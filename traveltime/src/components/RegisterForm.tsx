import {useEffect, useState} from 'react';
import {useUser} from '../hooks/apiHooks';
import useForm from '../hooks/formHooks';
import {RegisterCredentials} from '../types/LocalTypes';
import {useUserContext} from '../hooks/contextHooks';

// create a new user
const RegisterForm = (props: {toggleRegister: () => void}) => {
  const {toggleRegister} = props;
  const {handleLogin} = useUserContext();
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const {postRegister, getUsernameAvailable, getEmailAvailable} = useUser();
  const initValues: RegisterCredentials = {
    username: '',
    email: '',
    password_hash: '',
  };

  const doRegister = async () => {
    try {
      const registerResult = await postRegister(inputs as RegisterCredentials);
      if (registerResult) {
        handleLogin(inputs as RegisterCredentials);
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const {handleSubmit, handleInputChange, inputs, setInputs} = useForm(
    doRegister,
    initValues,
  );

  // check if username is available
  useEffect(() => {
    const main = async () => {
      try {
        if (inputs.username.length > 2) {
          const result = await getUsernameAvailable(inputs.username);
          setUsernameAvailable(result.available ?? true);
        } else {
          setUsernameAvailable(true);
        }
      } catch (error) {
        console.error((error as Error).message);
        setUsernameAvailable(true);
      }
    };

    main();
  }, [inputs.username]);

  // check if email is available
  useEffect(() => {
    const main = async () => {
      try {
        if (inputs.email.length > 5) {
          const result = await getEmailAvailable(inputs.email);
          setEmailAvailable(result.available ?? true);
        } else {
          setEmailAvailable(true);
        }
      } catch (error) {
        console.error((error as Error).message);
        setEmailAvailable(true);
      }
    };

    main();
  }, [inputs.email]);

  useEffect(() => {
    return () => {
      setUsernameAvailable(true);
      setEmailAvailable(true);
      setInputs(initValues);
    };
  }, []);

  return (
    <>
      <div className="bg-gradient-to-t from-darkgreen to-green w-70 md:w-80 m-auto rounded-xl text-lightblue shadow-transparent-blue shadow-sm mt-3">
        <img
          src="../svg/logo-no-background.svg"
          alt="TravelTime logo"
          className="w-35 h-20 object-cover md:w-40 md:h-25 m-auto mt-6"
        />
        <div className='m-1 my-2'>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center"
          >
            <div className=" flex w-4/5 flex-col p-1">
              <label htmlFor="registerusername" className="font-bold">
                Username
              </label>
              <input
                className={`text-darkergreen my-2 rounded-md p-1.5 border-0 bg-lightblue focus:bg-offwhite focus:ring-0 focus:outline-none valid:border-1 invalid:border-1 invalid:border-rose-600 ${!usernameAvailable ? 'border-rose-600' : 'valid:border-validgreen'}`}
                name="username"
                type="text"
                id="registerusername"
                onChange={handleInputChange}
                autoComplete="off"
                required
                minLength={3}
                maxLength={15}
              />
              {!usernameAvailable && (
                <p className="text-right text-rose-600 text-sm p-0 m-0">
                  Username not available
                </p>
              )}
            </div>
            <div className="flex w-4/5 flex-col p-1">
              <label htmlFor="registeremail" className="font-bold">
                Email
              </label>
              <input
                className={`text-darkergreen my-2 rounded-md p-1.5 border-0 bg-lightblue focus:bg-offwhite focus:ring-0 focus:outline-none valid:border-1 invalid:border-1 invalid:border-rose-600 ${!emailAvailable ? 'border-rose-600' : ' valid:border-validgreen'}`}
                name="email"
                type="email"
                id="registeremail"
                onChange={handleInputChange}
                autoComplete="off"
                required
                minLength={3}
                maxLength={100}
              />
              {!emailAvailable && (
                <p className="text-right text-rose-600 text-sm p-0 m-0">Email not available</p>
              )}
            </div>
            <div className="flex w-4/5 flex-col p-1">
              <label htmlFor="registerpassword" className="font-bold">
                Password
              </label>
              <input
                className="text-darkergreen my-2 rounded-md p-1.5 border-0 bg-lightblue focus:bg-offwhite focus:ring-0 focus:outline-none valid:border-validgreen valid:border-1 invalid:border-1 invalid:border-rose-600"
                name="password_hash"
                type="password"
                id="registerpassword"
                onChange={handleInputChange}
                autoComplete="off"
                required
                minLength={10}
                maxLength={100}
              />
            </div>
            <button
              className="my-6 block w-25 rounded-4xl bg-lightblue text-darkgreen py-1 transition-all duration-500 ease-in-out hover:bg-green hover:text-lightblue shadow-lg font-bold cursor-pointer transform hover:scale-105 active:scale-95"
              type="submit"
            >
              Register
            </button>
          </form>
        </div>
      </div>
      <div className="text-center m-2 my-4">
        <p>Already have an account?</p>
        <button
          type="button"
          onClick={toggleRegister}
          className="m-auto my-4 block w-20 rounded-4xl bg-transparent-blue text-darkergreen py-1 transition-all duration-500 ease-in-out hover:bg-green hover:text-lightblue shadow-lg font-bold cursor-pointer transform hover:scale-105 active:scale-95"
        >
          Login
        </button>
      </div>
    </>
  );
};

export default RegisterForm;
