import {Link} from 'react-router';
import {useFollowStore} from '../store';
import { useUserContext } from '../hooks/contextHooks';

// display user followers
const Followers = () => {
  const {followers} = useFollowStore();
  const {user} = useUserContext();

  return (
    <>
      <section>
        <div className="flex flex-col p-2 rounded-lg my-2 sm:w-4/5 md:w-3/5 md:max-w-170 m-auto pb-5">

          <h2 className="font-bold text-darkergreen text-center my-3">
            Your followers
          </h2>
          {followers.length > 0 ? (
            followers.map((follower) => (
              <div key={follower.follower_id} className="flex flex-row p-2 items-center text-darkgreen w-60 m-auto">
                <Link to={`/profile/${follower.follower_id}`}>
                  <img
                    src={
                      user
                        ? 'http://localhost:3002/uploads/' +
                          follower.profile_picture
                        : undefined
                    }
                    alt="profile picture"
                    className="w-10 h-10 object-cover rounded-full ml-10 mr-4 bg-offwhite"
                  />
                </Link>
                <Link to={`/profile/${follower.follower_id}`}>
                  <p>{follower.username}</p>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center p-2 text-darkgreen">No followers</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Followers;
