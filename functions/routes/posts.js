const { db } = require("../helpers/admin");

exports.getPosts = async (req, res) => {
  try {
    const docs = await db.collection("posts").get();
    const posts = docs.map((doc) => {
      const { body, userID, date, comments, reactions } = doc.data();
      return {
        body,
        userID,
        postID: doc.id,
        date,
        comments,
        reactions
      };
    });
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.code });
  }
};

exports.addPost = async (req, res) => {
  const { body } = req.body;
  const { uid } = req.user;
  const date = new Date().toISOString();
  const newPost = {
    body,
    handle: req.user.handle,
    uid,
    date,
    reactions: { likes: 0, loves: 0 },
    comments: []
  };
  try {
    const post = await db.collection("posts").add(newPost);
    return res
      .status(201)
      .json({ message: `document ${post.id} created successfully` });
  } catch (err) {
    return res.status(500).json({ error: `something went wrong ${err}` });
  }
};

exports.addComment = async (req, res) => {
  const { body, postId } = req.body;
  const { uid } = req.user;
  const date = new Date().toISOString();
  try {
    const postRef = await db.doc(`posts/${postId}`);
    const post = await postRef.get();
    const { comments } = post.data();
    const time = await postRef.update({
      comments: [...comments, { body, uid, date }]
    });
    return res.status(201).json(`Comments updated at ${time}`);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err });
  }
};
