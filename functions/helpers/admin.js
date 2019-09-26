const admin = require("firebase-admin");
const { adminConfig } = require("../config");
admin.initializeApp(adminConfig);
const db = admin.firestore();

const dbAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const idToken = authHeader.replace("Bearer ", "");
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const users = await db
        .collection("users")
        .where("uid", "==", decodedToken.uid)
        .limit(1)
        .get();
      const [userSnapshot] = users.docs;
      const { handle } = userSnapshot.data();

      req.user = decodedToken;
      req.user.handle = handle;

      return next();
    } catch (err) {
      console.log(err);
      return res.status(403).json({ erorr: err });
    }
  }
  return res.status(403).json({ erorr: "Unauthorized" });
};

module.exports = { admin, dbAuth, db };
