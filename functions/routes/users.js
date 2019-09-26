const { validateSignUp, validateLogIn } = require("./users-validation");
const { db } = require("../helpers/admin");
const { config } = require("../config");
const firebase = require("firebase");
const BusBoy = require("busboy");
const path = require("path");
const os = require("os");
const of = require("of");
firebase.initializeApp(config);

exports.signup = async (req, res) => {
  const { handle, email, password } = req.body;
  const validationError = validateSignUp(req.body);
  if (validationError !== "") {
    return res.status(400).json({ error: validationError });
  }
  try {
    const doc = await db.doc(`/users/${handle}`).get();
    if (doc.exists) {
      return res.status(400).json({ handle: "This handle is already taken" });
    }
    const { user } = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const [idToken, uid] = await Promise.all([user.getIdToken(), user.uid]);
    const userCredentials = {
      handle,
      email,
      createdAt: new Date().toISOString(),
      uid
    };
    await db.doc(`/users/${handle}`).set(userCredentials);
    return res.status(201).json({ idToken });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/email-already-in-use") {
      return res.status(400).json({ email: "Email is already in use" });
    }
    return res.status(500).json({ error: err.code });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const validationError = validateLogIn(req.body);
  if (validationError !== "") {
    return res.status(400).json({ error: validationError });
  }
  try {
    const { user } = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const idToken = await user.getIdToken();
    return res.status(200).json({ idToken });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/wrong-password") {
      res.status(403).json({ general: "Wrong credentials, please try again" });
    }
    return res.status(500).json({ error: err.code });
  }
};

exports.uploadImage = async (req, res) => {
  const bb = new BusBoy({ headers: req.headers });
  bb.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const [imageExt] = filename.split(".").slice(-1);
  });
};
