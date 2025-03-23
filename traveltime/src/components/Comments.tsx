import {PostWithOwner} from '../types/LocalTypes';
import {useUserContext} from '../hooks/contextHooks';
import useForm from '../hooks/formHooks';
import {useCommentStore} from '../store';
import {useEffect, useRef, useState} from 'react';
import {useComment} from '../hooks/apiHooks';
import {Link} from 'react-router';

// display the comments and do comment field
const Comments = ({post}: {post: PostWithOwner}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [openCommentForm, setOpenCommentForm] = useState(false);
  const {user} = useUserContext();
  const {comments, setComments} = useCommentStore();
  const {postComment, getCommentsByPostId, deleteComment} = useComment();

  // set initvalue
  const initValues = {comment_text: ''};

  // open comment form to add a comment
  const openForm = () => {
    setOpenCommentForm(!openCommentForm);
  };

  // do comment
  const doComment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    try {
      await postComment(
        post.post_id,
        post.user_id,
        post.profile_picture || '',
        inputs.comment_text,
        token,
      );
      // update comments after post
      getComments();

      // reset the input field
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      setInputs(initValues);
    } catch (error) {
      console.error('Error postin comment:', (error as Error).message);
    }
  };

  const {handleSubmit, handleInputChange, inputs, setInputs} = useForm(
    doComment,
    initValues,
  );

  // get all comments by post_id
  const getComments = async () => {
    try {
      const comments = await getCommentsByPostId(post.post_id);
      if (!comments) {
        return;
      }
      // display the comments
      setComments(comments);
    } catch (error) {
      // if no comments set an empty arrya
      setComments([]);
      console.error((error as Error).message);
    }
  };

  // delete comment (post owner, comment owner or admin)
  const handleCommentDelete = async (comment_id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      await deleteComment(comment_id, token);
      // get the new comments after successful delete
      getComments();
    } catch {
      setComments([]);
      return;
    }
  };

  // get the comments after post_id changes
  useEffect(() => {
    getComments();
    return () => {
      setComments([]);
    };
  }, [post.post_id]);

  return (
    <>
      {user && !openCommentForm && (
        <section className="flex w-full mb-3 my-2">
          <button
            type="button"
            onClick={openForm}
            className="rounded-4xl bg-green p-1 px-3 transition-all duration-500 ease-in-out hover:bg-lightgreen shadow-lg text-offwhite cursor-pointer transform hover:scale-105 active:scale-95"
          >
            Add comment
          </button>
        </section>
      )}
      {openCommentForm && (
        <section className="flex-col gap-2 my-2 w-full">
          <form
            className="mb-4 flex flex-col items-center justify-center rounded-md bg-gradient-to-b from-lightgreen to-green p-2"
            onSubmit={handleSubmit}
          >
            <div className="m-1 flex w-full flex-col p-2">
              <input
                className="my-1 rounded-md p-2.5 bg-offwhite focus:bg-offwhite focus:ring-0 focus:outline-none shadow-lg"
                name="comment_text"
                type="text"
                id="comment_text"
                maxLength={100}
                onChange={handleInputChange}
                autoComplete="off"
                ref={inputRef}
                value={inputs.comment_text}
              />
            </div>
            <div className="flex w-full gap-2 px-2 my-1">
              <button
                disabled={!inputs.comment_text}
                className="rounded-4xl bg-lightblue text-darkergreen px-3 transition-all duration-500 ease-in-out hover:bg-lightgreen shadow-lg hover:text-offwhite cursor-pointer transform hover:scale-105 active:scale-95"
                type="submit"
              >
                Post
              </button>
              <button
                type="button"
                onClick={openForm}
                className="rounded-4xl bg-transparent-blue text-darkergreen px-3 transition-all duration-500 ease-in-out hover:bg-darkgreen shadow-lg hover:text-offwhite cursor-pointer transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
      {comments.length > 0 && (
        <div className="w-full m-auto bg-gradient-to-b from-green to-darkgreen rounded-lg shadow-lg p-1">
          <h3 className="font-bold text-offwhite p-2 mb-4">Comments</h3>
          {comments.map((comment) => (
            <div key={comment.comment_id}>
              <div className="flex gap-2 m-2 items-center w-full text-offwhite">
                <Link to={`/profile/${comment.user_id}`}>
                  <img
                    src={
                      user
                        ? 'https://ucad-server-https.northeurope.cloudapp.azure.com/upload/uploads/' +
                          comment.profile_picture
                        : undefined
                    }
                    alt="profile picture"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </Link>
                <Link to={`/profile/${comment.user_id}`}>
                  <p className="font-bold">{comment.username}</p>
                </Link>
              </div>
              <section className="flex flex-col">
                <span className="right-1 mx-2 text-sm absolute z-10 -mt-5 text-offwhite">
                  {comment.created_at &&
                    new Date(comment.created_at).toLocaleDateString('fi-FI')}
                </span>
                <p className="p-2 bg-offwhite m-2 mt-1 rounded-lg font-light relative shadow-lg">
                  {comment.comment_text}
                </p>
              </section>
              {user &&
                (user.user_id === comment.user_id ||
                  user.user_id === post.user_id ||
                  user.level_name === 'Admin') && (
                  <section className="flex justify-end w-full px-2 my-1">
                    <button
                      type="button"
                      onClick={() =>
                        comment.comment_id !== undefined &&
                        handleCommentDelete(comment.comment_id)
                      }
                      className="rounded-4xl bg-green px-2 p-0.5 transition-all duration-500 ease-in-out hover:bg-darkergreen shadow-lg text-offwhite font-light cursor-pointer transform hover:scale-105 active:scale-95 text-sm"
                    >
                      Delete
                    </button>
                  </section>
                )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Comments;
