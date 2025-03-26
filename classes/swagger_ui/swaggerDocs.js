/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

/**
 * @swagger
 * /reset:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Password reset
 */

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Send a message to the chatbot
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chatbot response and audio
 */

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Email sent if account exists
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user details
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Returns user info
 */

/**
 * @swagger
 * /get-all-users:
 *   get:
 *     summary: Get list of all users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */

/**
 * @swagger
 * /api-stats:
 *   get:
 *     summary: Get per-user API usage statistics
 *     tags: [Stats]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Per-user API usage
 */

/**
 * @swagger
 * /endpoint-stats:
 *   get:
 *     summary: Get endpoint usage statistics
 *     tags: [Stats]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Per-endpoint usage
 */

/**
 * @swagger
 * /update-api-calls:
 *   put:
 *     summary: Update API call limit for a user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, api_calls_left]
 *             properties:
 *               email:
 *                 type: string
 *               api_calls_left:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated successfully
 */

/**
 * @swagger
 * /update-role:
 *   put:
 *     summary: Update user role (admin-only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, role]
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Role updated
 */

/**
 * @swagger
 * /delete-user:
 *   delete:
 *     summary: Delete a user (admin-only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
