const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.Mixed, ref: 'User', required: true }, //Mixed type bcoz i want object id and username bith
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema)
module.exports = BlogPost;
