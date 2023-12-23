const express = require('express');
const router = express.Router()
const { authenticateToken } = require("../Middlewares/authMiddleware");
const { getAllBlogs, getAllBlogsByID, createBlogPost, getBlogByPostId, updateBlogPost, deleteBlogPost } = require('../controllers/blogController');


/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of blogs
 *         content:
 *           application/json:
 *             example:
 *               blogs: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Server Error
 */


/**
 * @swagger
 * /api/blog/{userId}:
 *   get:
 *     summary: Get all blogs by user ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of blogs by user ID
 *         content:
 *           application/json:
 *             example:
 *               blogs: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Server Error
 */


/**
 * @swagger
 * /api/blog/create-blog:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Blog created successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: Authentication failed
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Server Error
 */

/**
 * @swagger
 * /api/blog/blogs/{postId}:
 *   get:
 *     summary: Get a blog post by post ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               blog: {}
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Server Error
 *   put:
 *     summary: Update a blog post by post ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Blog updated successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: Authentication failed
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Server Error
 *   delete:
 *     summary: Delete a blog post by post ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Blog deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: Authentication failed
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Server Error
 */

// Read all blogs (public) visible also if not authenticated
router.route("/").get(getAllBlogs)
router.route("/:userId").get(getAllBlogsByID)
router.route("/create-blog").post(authenticateToken, createBlogPost)
router.route("/blogs/:postId").get(authenticateToken, getBlogByPostId)
router.route("/blogs/:postId").put(authenticateToken, updateBlogPost)
router.route("/blogs/:postId").delete(authenticateToken, deleteBlogPost)

module.exports = router
