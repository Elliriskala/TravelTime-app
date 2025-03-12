/**
 * @api {post} /login User login
 * @apiName Login
 * @apiGroup Auth
 * @apibody {String} username Username of the user.
 * @apibody {String} password_hash Hashed password of the user.
 * @apiSuccess {String} token JWT token.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Unauthorized
 *     {
 *       "message": "Incorrect username/password"
 *     }
 */
