import {useState} from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = () => {
  const [displayRegister, setDisplayRegister] = useState(false);

  const toggleRegister = () => {
    setDisplayRegister(!displayRegister);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <section className="flex items-center flex-col justify-center">
        {displayRegister ? (
          <RegisterForm toggleRegister={toggleRegister} />
        ) : (
          <LoginForm toggleRegister={toggleRegister} />
        )}
      </section>
    </div>
  );
};

export default Login;
