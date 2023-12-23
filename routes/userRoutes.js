const express = require("express");
const { registerUser, authUser } = require("../controllers/userController");
const router = express.Router();

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User registered successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid request body
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     examples:
 *       example1:
 *         summary: Example of a successful login
 *         value:
 *           email: ""
 *           password: "password123"
 *       example2:
 *         summary: Example of an unsuccessful login
 *         value:
 *           email: ""
 *           password: "wrongpassword"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               token: JWT_TOKEN
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid credentials
 */


router.post("/register", registerUser);
router.post("/login", authUser);

module.exports = router;
