import {Route, BrowserRouter as Router, Routes} from 'react-router';
import Layout from './components/Layout';
import Explorepage from './views/Explorepage';
import Login from './views/Login';
import {UserProvider} from './contexts/UserContext';
import Profile from './views/Profile';
import Post from './views/Post';
import Contact from './views/ContactPage';

const App = () => {
  return (
    <Router basename="">
      <UserProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Explorepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:user_id" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/post" element={<Post />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
};
export default App;
