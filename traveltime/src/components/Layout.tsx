import {Outlet} from 'react-router';
import Navbar from './Navbar';
import {useUserContext} from '../hooks/contextHooks';
import {useEffect} from 'react';

const Layout = () => {
  const {user, handleAutoLogin} = useUserContext();

  useEffect(() => {
    if (!user) {
      try {
        handleAutoLogin();
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen">
        <main className="flex flex-col mx-4 my-2 lg:mx-20 pb-25">
          <Outlet />
        </main>
        <Navbar />
      </div>
    </>
  );
};

export default Layout;
