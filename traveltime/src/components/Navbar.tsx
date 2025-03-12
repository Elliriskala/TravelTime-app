import {Link, useLocation} from 'react-router';
import {useUserContext} from '../hooks/contextHooks';
import {LuLogIn, LuUser} from 'react-icons/lu';
import {MdOutlineContactSupport} from 'react-icons/md';
import Logout from '../views/Logout';
import {SlGlobe} from 'react-icons/sl';

// navigation
const Navbar = () => {
  const {user} = useUserContext();
  const location = useLocation();

  const selectedTab = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div>
      <nav className="bg-darkergreen shadow-xl items-center justify-between z-60 fixed w-full bottom-0 flex-row flex p-4">
        <Link to="/">
          <img
            src="../svg/logo-no-background.svg"
            alt="TravelTime logo"
            className="w-15 h-8 md:w-20 md:h-10 object-cover"
          />
        </Link>
        {user ? (
          <div className="flex flex-row items-center m-1">
            <Link to="/">
              <div
                className={`flex items-center transition-all duration-300 ease-in-out hover:text-lightgreen p-2 cursor-pointer transform hover:scale-105 active:scale-95 ${
                  selectedTab('/') ? 'text-lightgreen' : 'hover:text-lightgreen'
                }`}
              >
                <SlGlobe className="mx-1" size={20} />
                <p className="md:mx-1 hidden md:block">Explore page</p>
              </div>
            </Link>
            <Link to={`/profile/${user?.user_id}`}>
              <div
                className={`flex items-center transition-all duration-300 ease-in-out hover:text-lightgreen p-2 cursor-pointer transform hover:scale-105 active:scale-95 ${
                  selectedTab(`/profile/${user?.user_id}`)
                    ? 'text-lightgreen'
                    : 'hover:text-lightgreen'
                }`}
              >
                <LuUser className="mx-1" size={20} />
                <p className="md:mx-1 hidden md:block">Your profile</p>
              </div>
            </Link>

            <Link to="/contact">
              <div
                className={`flex items-center transition-all duration-300 ease-in-out hover:text-lightgreen p-2 cursor-pointer transform hover:scale-105 active:scale-95 ${
                  selectedTab('/contact')
                    ? 'text-lightgreen'
                    : 'hover:text-lightgreen'
                }`}
              >
                <MdOutlineContactSupport className="mx-1" size={20} />
                <p className="md:mx-1 hidden md:block">Contact</p>
              </div>
            </Link>
            <Logout />
          </div>
        ) : (
          <div className="flex flex-row items-center m-1">
            <Link to="/contact">
              <div
                className={`flex items-center transition-all duration-300 ease-in-out hover:text-lightgreen p-2 cursor-pointer transform hover:scale-105 active:scale-95 ${
                  selectedTab('/contact')
                    ? 'text-lightgreen'
                    : 'hover:text-lightgreen'
                }`}
              >
                <MdOutlineContactSupport className="mx-1" size={20} />
                <p className="med:mx-1 hidden md:block">Contact</p>
              </div>
            </Link>
            <Link to="/login">
              <div
                className={`flex items-center transition-all duration-300 ease-in-out hover:text-lightgreen p-2 cursor-pointer transform hover:scale-105 active:scale-95 ${
                  selectedTab('/login')
                    ? 'text-lightgreen'
                    : 'hover:text-lightgreen'
                }`}
              >
                <LuLogIn className="mx-1" size={20} />
                <p className="md:mx-1 hidden md:block">Login</p>
              </div>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
