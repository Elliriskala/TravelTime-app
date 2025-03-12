/**
 * @api {get} /users Get all users
 * @apiName GetAllUsers
 * @apiGroup User
 * @apiSuccess {Object[]} users List of users.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No users found"
 *     }
*/

/**
 * @api {get} /users/:user_id Get user by ID
 * @apiName GetUserById
 * @apiGroup User
 * @apiParam {Number} user_id User's unique ID.
 * @apiSuccess {Object} user User object.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No users found"
 *     }
 */

/**
 * @api {post} /users Create a new user
 * @apiName PostNewUser
 * @apiGroup User
 * @apibody {String} username Username of the user.
 * @apibody {String} email Email of the user.
 * @apibody {String} password_hash hashed Password of the user.
 * @apiSuccess {Object} user Created user object.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "message": "User not created"
 *     }
 */

/**
 * @api {put} /users Update an existing user
 * @apiName UpdateUser
 * @apiGroup User
 * @apiHeader {String} Authorization User's access token.
 * @apibody {String} [profile_picture] Optional profile picture
 * @apibody {String} [username] Optional new username.
 * @apibody {String} [email] Optional new email.
 * @apibody {String} [password_hash] Optional new password.
 * @apibody {String} [profile_info] Optional info of the user
 * @apiSuccess {Object} user Updated user object.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "message": "User not updated"
 *     }
 */

/**
 * @api {delete} /users Delete the authenticated user
 * @apiName DeleteUser
 * @apiGroup User
 * @apiHeader {String} Authorization User's access token.
 * @apiSuccess {String} message Success message.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "message": "User not deleted"
 *     }
 */

/**
 * @api {get} /users/token Check token validity
 * @apiName CheckToken
 * @apiGroup User
 * @apiHeader {String} Authorization User's access token.
 * @apiSuccess {String} message Success message.
 * @apiError {String} message Error message.
 */

/**
 * @api {delete} /users/:user_id Delete user as an admin
 * @apiName DeleteUserAsAdmin
 * @apiGroup User
 * @apiHeader {String} Authorization Admin's access token.
 * @apiParam {Number} user_id User's unique ID.
 * @apiSuccess {String} message Success message.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "message": "User not deleted"
 *     }
 */

/**
 * @api {get} /users/email/:email Get user email to check if it already exists
 * @apiName CheckEmailExists
 * @apiGroup User
 * @apiParam {String} email Email inserted by the user
 * @apiSuccess {String} message Available: True
 * @apiError {String} message Available: False
 */

/**
 * @api {get} /users/username/:username Get user username to check if it already exists
 * @apiName CheckUsernameExists
 * @apiGroup User
 * @apiParam {String} username Username inserted by the user
 * @apiSuccess {String} message Available: True
 * @apiError {String} message Available: False
 */
