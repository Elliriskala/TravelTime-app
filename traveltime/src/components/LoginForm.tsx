import useForm from '../hooks/formHooks';
import {Credentials} from '../types/LocalTypes';
import {useUserContext} from '../hooks/contextHooks';

const LoginForm = (props: {toggleRegister: () => void}) => {
  const {toggleRegister} = props;
  const {handleLogin} = useUserContext();
  const initValues: Credentials = {
    username: '',
    password_hash: '',
  };

  // do login
  const doLogin = async () => {
    try {
      handleLogin(inputs as Credentials);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doLogin,
    initValues,
  );

  return (
    <>
      <div className="bg-gradient-to-t from-darkgreen to-green w-70 md:w-80 rounded-xl text-lightblue shadow-transparent-blue shadow-sm">
        <img
          src="/~ellinor/travelTime/svg/logo-no-background.svg"
          alt="TravelTime logo"
          className="w-35 h-20 object-cover md:w-40 md:h-25 m-auto mt-6"

        />
        <div className="m-1 my-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center"
          >
            <div className=" flex w-4/5 flex-col p-1 my-2">
              <label htmlFor="registerusername" className="font-bold">
                Username
              </label>
              <input
                className="text-darkergreen my-2 rounded-md p-1.5 border-0 bg-lightblue focus:bg-offwhite focus:ring-0 focus:outline-none valid:border-1 invalid:border-1 invalid:border-rose-600 valid:border-validgreen"
                name="username"
                type="text"
                id="registerusername"
                onChange={handleInputChange}
                autoComplete="off"
                required
                minLength={3}
                maxLength={15}
              />
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
              className="my-6 block w-20 rounded-4xl bg-lightblue text-darkgreen py-1 transition-all duration-500 ease-in-out hover:bg-green hover:text-lightblue shadow-lg font-bold cursor-pointer transform hover:scale-105 active:scale-95"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <div className="text-center m-2 my-4">
        <p>Want to create an account?</p>
        <button
          type="button"
          onClick={toggleRegister}
          className="m-auto my-4 block w-25 rounded-4xl bg-transparent-blue text-darkergreen py-1 transition-all duration-500 ease-in-out hover:bg-green hover:text-lightblue shadow-lg font-bold cursor-pointer transform hover:scale-105 active:scale-95"
        >
          Register
        </button>
      </div>
    </>
  );
};

export default LoginForm;
