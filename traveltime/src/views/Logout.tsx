import {LuLogOut} from 'react-icons/lu';
import {useUserContext} from '../hooks/contextHooks';
import {Link} from 'react-router';

const Logout = () => {
  const {handleLogout} = useUserContext();

  return (
    <div>
      <Link to="/login">
        <button
          onClick={handleLogout}
          className="flex items-center text-lightblue transition-all duration-300 ease-in-out hover:text-lightgreen cursor-pointer transform hover:scale-105 active:scale-95 p-2"
        >
          <LuLogOut className="mx-1" size={20} />
          <p className="md:mx-1 hidden md:block">Log out</p>
        </button>
      </Link>
    </div>
  );
};

export default Logout;
