const functions = require("firebase-functions");
const firebase = require("firebase");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const { dbAuth } = require("./helpers/admin");
const { addPost, getPosts, addComment } = require("./routes/posts");
const { login, signup, uploadImage } = require("./routes/users");

app.post("/posts", dbAuth, addPost);
app.put("/posts/:postId", dbAuth, addComment);
app.get("/posts", getPosts);

app.post("/login", login);
app.post("/signup", signup);
app.post("/user/image", uploadImage);

exports.api = functions.region("europe-west1").https.onRequest(app);
