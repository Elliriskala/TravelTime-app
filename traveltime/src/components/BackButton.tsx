import {NavigateFunction, useNavigate} from 'react-router';

// back button to go back to previous page
const BackButton = () => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <button
      className="m-2 rounded-4xl bg-lightblue p-1 px-3 transition-all duration-500 ease-in-out hover:bg-offwhite shadow-xl font-bold text-darkgreen transform hover:scale-105 active:scale-95"
      onClick={() => {
        navigate(-1);
      }}
    >
      back
    </button>
  );
};

export default BackButton;
