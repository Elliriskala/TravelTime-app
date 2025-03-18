import {Link} from 'react-router';
import {useFollowStore} from '../store';
import { useUserContext } from '../hooks/contextHooks';

// display user followings
const Followings = (
) => {
  const {followings} = useFollowStore();
  const {user} = useUserContext();

  return (
    <section>
      <div className="flex flex-col p-2 my-2 w-full sm:w-4/5 md:w-3/5 md:max-w-170 m-auto pb-5">

        <h2 className="font-bold text-darkergreen text-center my-3">
          Your followings
        </h2>
        {followings.length > 0 ? (
          followings.map((following) => (
            <div key={following.following_id} className="flex flex-row p-2 items-center text-darkgreen w-60 m-auto">
              <Link to={`/profile/${following.following_id}`}>
                <img
                  src={
                    user
                      ? 'https://ucad-server-https.northeurope.cloudapp.azure.com:3002/uploads/' +
                        following.profile_picture
                      : undefined
                  }
                  alt="profile picture"
                  className="w-10 h-10 object-cover rounded-full ml-10 mr-4 bg-offwhite"
                />
              </Link>
              <Link to={`/profile/${following.following_id}`}>
                <p>{following.username}</p>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center p-2 text-darkgreen">No followings</p>
        )}
      </div>
    </section>
  );
};

export default Followings;
