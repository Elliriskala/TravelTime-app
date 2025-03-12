/**
 * @api {get} /posts Get all travel posts
 * @apiName GetAllTravelPosts
 * @apiGroup TravelPost
 * @apiSuccess {Object[]} posts List of travel posts.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "post_id": 1,
 *       "user_id": 1,
 *       "filename": "example.png",
 *       "media_type": "image/png",
 *       "continent": "Europe",
 *       "country": "Finland",
 *       "city": "Helsinki",
 *       "start_date": "2025-01-01",
 *       "end_date": "2025-01-10",
 *       "description": "A wonderful trip to Helsinki.",
 *       "created_at": "2025-01-15T12:00:00Z"
 *     }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not found
 *     {
 *       "message": "No posts found"
 *     }
 */

/**
 * @api {get} /posts/:post_id Get travel post by ID
 * @apiName GetTravelPostById
 * @apiGroup TravelPost
 * @apiParam {Number} post_id Travel post's unique ID.
 * @apiSuccess {Object} post Travel post object.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not found
 *     {
 *       "message": "No posts found"
 *     }
 */

/**
 * @api {get} /posts/byuser/:user_id Get travel posts by user ID
 * @apiName GetTravelPostsByUserId
 * @apiGroup TravelPost
 * @apiPermission token
 * @apiParam {Number} user_id User's unique ID.
 * @apiSuccess {Object[]} posts List of travel posts.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not found
 *     {
 *       "message": "No posts found"
 *     }
 */

/**
 * @api {get} /posts/bydestination/:filterValue Get travel posts by destination
 * @apiName GetTravelPostsByDestination
 * @apiGroup TravelPost
 * @apiParam {String} filterValue Destination filter value (continent, country, city).
 * @apiSuccess {Object[]} posts List of travel posts.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not found
 *     {
 *       "message": "No posts found"
 *     }
 */

/**
 * @api {get} /posts/bytags/:tag_name Get travel posts by tags
 * @apiName GetTravelPostsByTags
 * @apiGroup TravelPost
 * @apiParam {String} tag_name Tag name.
 * @apiSuccess {Object[]} posts List of travel posts.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not found
 *     {
 *       "message": "No posts found"
 *     }
 */

/**
 * @api {post} /posts Post a travel post
 * @apiName PostTravelPost
 * @apiGroup TravelPost
 * @apiPermission token
 * @apiHeader {String} Authorization User's access token.
 * @apiBody {String} filename Filename of the media.
 * @apiBody {String} media_type Media type (e.g., image/jpeg).
 * @apiBody {String} continent Continent name.
 * @apiBody {String} country Country name.
 * @apiBody {String} city City name.
 * @apiBody {Date} start_date Start date of the travel.
 * @apiBody {Date} end_date End date of the travel.
 * @apiBody {String} description Description of the travel post.
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} post Travel post object.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Post created",
 *       "post": {
 *         "post_id": 1,
 *         "user_id": 1,
 *         "filename": "example.png",
 *         "media_type": "image/png",
 *         "continent": "Europe",
 *         "country": "Finland",
 *         "city": "Helsinki",
 *         "start_date": "2025-01-01",
 *         "end_date": "2025-01-10",
 *         "description": "A wonderful trip to Helsinki.",
 *         "created_at": "2025-01-15T12:00:00Z"
 *       }
 *     }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "message": "Post not created"
 *     }
 */

/**
 * @api {delete} /posts/:post_id Delete a travel post
 * @apiName DeleteTravelPost
 * @apiGroup TravelPost
 * @apiPermission token
 * @apiHeader {String} Authorization User's access token.
 * @apiParam {Number} post_id Travel post's unique ID.
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Post deleted"
 *     }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "message": "Post not deleted"
 *     }
 */
