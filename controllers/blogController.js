const User = require("../Models/user");
const BlogPost = require("../Models/blogs");

// Get all blog posts with author information
const getAllBlogs = async (req, res) => {
  try {
    // Fetch all blog posts from the database
    const blogPosts = await BlogPost.find();

    // Populate author information for each blog post
    const populatedBlogPosts = await Promise.all(
      blogPosts.map(async (post) => {
        const user = await User.findById(post.author);
        return {
          title: post.title,
          content: post.content,
          author: user ? user.username : null,
        };
      })
    );

    // Respond with the populated blog posts
    res.json(populatedBlogPosts);
  } catch (error) {
    // Handle errors and respond with a 500 Internal Server Error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all blogs by user ID with author information
const getAllBlogsByID = async (req, res) => {
  try {
    // Fetch the user by ID and populate their blog posts
    const user = await User.findById(req.params.userId).populate("blogPosts");

    // If the user is not found, respond with a 404 Not Found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map the user's blog posts with author information
    const populatedBlogPosts = user.blogPosts.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      author: user.username,
    }));

    // Respond with the populated blog posts
    res.json(populatedBlogPosts);
  } catch (error) {
    // Handle errors and respond with a 500 Internal Server Error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new blog post and associate it with the user
const createBlogPost = async (req, res) => {
  try {
    // Extract title and content from the request body
    const { title, content } = req.body;

    // Find the user who is creating the blog post
    const user = await User.findById(req.user._id);

    // If the user is not found, respond with a 404 Not Found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new blog post with author information
    const blogPost = new BlogPost({
      title,
      content,
      author: { _id: user._id, username: user.username },
    });

    // Save the blog post and update the user's blogPosts array
    await blogPost.save();
    user.blogPosts.push(blogPost._id);
    await user.save();

    // Respond with the created blog post
    res.status(201).json(blogPost);
  } catch (error) {
    // Handle errors and respond with a 500 Internal Server Error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a blog post by post ID, ensuring the requester is the original author
const getBlogByPostId = async (req, res) => {
  try {
    // Find the blog post by ID
    const blogPost = await BlogPost.findById(req.params.postId);

    // If the blog post is not found, respond with a 404 Not Found
    if (!blogPost) {
      return res.status(404).json({ message: "Blog Post not found" });
    }

    // Check if the requester is the original author of the blog post
    if (blogPost.author.username !== req.user.username) {
      return res.status(403).json({ error: "Access denied. Not the original author of post" });
    }

    // Respond with the blog post
    res.json(blogPost);
  } catch (error) {
    // Handle errors and respond with a 500 Internal Server Error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a blog post, ensuring the requester is the original author
const updateBlogPost = async (req, res) => {
  try {
    // Extract title and content from the request body
    const { title, content } = req.body;

    // Find the blog post by ID
    const blogPost = await BlogPost.findById(req.params.postId);

    // If the blog post is not found, respond with a 404 Not Found
    if (!blogPost) {
      return res.status(404).json({ message: "Blog Post not found" });
    }

    // Check if the requester is the original author of the blog post
    if (blogPost.author.username !== req.user.username) {
      return res.status(403).json({ error: "Access denied. Not the original author of post" });
    }

    // Update the blog post with new title and content
    blogPost.title = title || blogPost.title;
    blogPost.content = content || blogPost.content;

    // Save the updated blog post
    await blogPost.save();

    // Respond with the updated blog post
    res.json(blogPost);
  } catch (error) {
    // Handle errors and respond with a 500 Internal Server Error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a blog post, ensuring the requester is the original author
const deleteBlogPost = async (req, res) => {
  try {
    // Find the blog post by ID
    const blogPost = await BlogPost.findById(req.params.postId);

    // If the blog post is not found, respond with a 404 Not Found
    if (!blogPost) {
      return res.status(404).json({ message: "Blog Post not found" });
    }

    // Check if the requester is the original author of the blog post
    if (blogPost.author.username !== req.user.username) {
      return res.status(403).json({ error: "You do not have permission to perform this action." });
    }

    // Find the user and remove the blog post ID from their blogPosts array
    const user = await User.findById(req.user._id);
    const index = user.blogPosts.indexOf(req.params.postId);

    if (index !== -1) {
      user.blogPosts.splice(index, 1);
      await user.save();
    }

    // Delete the blog post from the database
    await blogPost.deleteOne({ _id: req.params.postId });

    // Respond with a success message
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    // Handle errors and respond with a 500 Internal Server Error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllBlogs,
  getAllBlogsByID,
  createBlogPost,
  getBlogByPostId,
  updateBlogPost,
  deleteBlogPost,
};
