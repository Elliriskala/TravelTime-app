/**
 * @api {get} /tags Get all tags
 * @apiName GetAllTags
 * @apiGroup Tag
 * @apiSuccess {Object[]} tags List of tags.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "tag_id": 1,
 *         "tag_name": "Nature"
 *       },
 *       {
 *         "tag_id": 2,
 *         "tag_name": "Adventure"
 *       }
 *     ]
 */

/**
 * @api {get} /tags/bypost/:post_id Get tags by post ID
 * @apiName GetTagsByPostId
 * @apiGroup Tag
 * @apiParam {Number} post_id ID of the post.
 * @apiSuccess {Object[]} tags List of tags.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No tags found"
 *     }
 */

/**
 * @api {post} /tags Add a tag to a post
 * @apiName AddTagToPost
 * @apiGroup Tag
 * @apiPermission token
 * @apiHeader {String} Authorization User's access token.
 * @apiBody {String} tag_name Name of the tag.
 * @apiBody {Number} post_id ID of the post.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "message": "Tag not created"
 *     }
 */
