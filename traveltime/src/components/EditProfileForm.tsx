import {ChangeEvent, useEffect, useRef, useState} from 'react';
import {useFile, useUser} from '../hooks/apiHooks';
import useForm from '../hooks/formHooks';
import {useUserContext} from '../hooks/contextHooks';
import BackButton from './BackButton';
import {useNavigate} from 'react-router';

// edit user profile
const EditProfileForm = ({
  ifUploadSuccess,
  toggleEditProfile,
}: {
  ifUploadSuccess: () => void;
  toggleEditProfile: () => void;
}) => {
  const {user} = useUserContext();
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const {getUsernameAvailable, getEmailAvailable} = useUser();
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const {updateUser, deleteUser} = useUser();
  const [updateResult, setUpdateResult] = useState<string>('');
  const {postProfilePicture} = useFile();
  const navigate = useNavigate();

  // set init values to the form
  const initValues = {
    profile_picture: '',
    username: '',
    email: '',
    password_hash: '',
    profile_info: '',
  };

  // handle profile picture change
  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      setFile(evt.target.files[0]);
    }
  };

  // update the user
  const doUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUpdateResult('Token is missing');
        return;
      }

      // set the profile picture
      let profilePictureUrl = '';
      if (file) {
        const profilePictureResult = await postProfilePicture(file, token);
        profilePictureUrl = profilePictureResult.data.filename;
      }

      // get the inputs from the form fields to update
      const filteredInputs = Object.fromEntries(
        Object.entries(inputs).filter(([, value]) => value !== ''),
      );

      if (profilePictureUrl) {
        filteredInputs.profile_picture = profilePictureUrl;
      }

      // get the result of the update
      const userUpdateResult = await updateUser(token, filteredInputs);

      setUpdateResult(userUpdateResult.message);
      console.log('updateResult:', updateResult);
      // navigate to user profile after success
      ifUploadSuccess();
    } catch (e) {
      setUpdateResult((e as Error).message);
      return;
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doUpdate,
    initValues,
  );

  // delete user
  const doUserDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUpdateResult('Token is missing');
        return;
      }

      const userDeleteResult = await deleteUser(token);
      setUpdateResult(userDeleteResult.message);
      // on success navigate to login
      navigate('/login');
    } catch (e) {
      setUpdateResult((e as Error).message);
      return;
    }
  };

  // check if the username or email to update are available
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
    };
  }, []);

  return (
    <div
      className="flex flex-col bg-gradient-to-b from-transparent-blue to-blue mt-14 mb-4 shadow-lg w-full m-auto sm:w-4/5 md:w-3/5 md:max-w-140 p-1 relative rounded-lg
    "
    >
      <div className="absolute left-0 top-0 z-30 -mt-14 -mx-2">
        <BackButton />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full text-darkergreen flex flex-col justify-center m-auto"
      >
        <div className="flex flex-col p-2">
          <label htmlFor="file"></label>
          <input
            className="hidden"
            name="file"
            type="file"
            id="profilefile"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileRef}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="bg-lightblue text-darkergreen shadow-xl text-center p-2 rounded-xl transform-all duration-300 ease-in-out hover:bg-offwhite cursor-pointer w-50 justify-center m-auto my-4 transform hover:scale-105 active:scale-95"
          >
            + Add a profile picture
          </button>
        </div>
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-60 h-60 md:w-80 md:h-80 bg-lightblue my-6 shadow-lg justify-center items-center m-auto object-cover
          "
          />
        )}
        <div className="flex flex-col mx-4 md:mx-15 m-auto px-5 text:darkgreen">
          <h2 className="my-1 font-light -mx-2">Username</h2>
          <div className="w-full flex flex-col my-2">
            <section className="w-full flex flex-row items-center gap-3 my-1">
              <p className="w-1/2 font-bold">Current</p>
              <p className="w-1/2 font-bold">New</p>
            </section>
            <section className="w-full flex flex-row gap-3 items-center my-1">
              <p className="rounded-lg p-1 w-1/2 border-1 border-green bg-lightblue">
                {user ? user.username : ''}
              </p>
              <input
                type="text"
                className={`text-darkergreen rounded-lg p-1 bg-lightblue focus:bg-offwhite focus:ring-0 focus:outline-none invalid:border-1 invalid:border-rose-800 w-1/2 ${!usernameAvailable ? 'border-rose-800 border-1' : 'valid:border-0'}`}
                minLength={3}
                maxLength={15}
                autoComplete="off"
                name="username"
                onChange={handleInputChange}
              />
            </section>
            {!usernameAvailable && (
              <p className="text-right text-rose-800 text-sm p-0 m-0">
                Username not available
              </p>
            )}
          </div>
          <h2 className="my-2 font-light -mx-2">Email</h2>
          <div className="w-full flex flex-row my-2 gap-3 flex-wrap">
            <section className="w-full flex flex-col gap-2">
              <p className="font-bold">Current</p>
              <p className="rounded-lg p-1 border-1 border-green bg-lightblue">
                {user ? user.email : 'No email'}
              </p>
            </section>
            <section className="w-full flex flex-col gap-2">
              <p className="font-bold">New</p>
              <input
                type="email"
                name="email"
                className={`text-darkergreen rounded-lg p-1 w-full bg-lightblue focus:bg-offwhite focus:ring-0 focus:outline-none invalid:border-1 invalid:border-rose-800 ${!emailAvailable ? 'border-rose-800 border-1' : 'valid:border-0'}`}
                maxLength={50}
                autoComplete="off"
                onChange={handleInputChange}
              />
              {!emailAvailable && (
                <p className="text-right text-rose-800 text-sm p-0 m-0">
                  Email not available
                </p>
              )}
            </section>
          </div>
          <h2 className=" font-light -mx-2 my-2">Password</h2>
          <p className=" font-bold mt-1">New</p>
          <input
            type="password"
            className="p-1 bg-lightblue focus:bg-offwhite rounded-lg focus:outline-none focus:ring-0 shadow-lg my-2 text-darkergreen invalid:border-1 invalid:border-rose-800"
            minLength={10}
            maxLength={30}
            autoComplete="off"
            name="password_hash"
            onChange={handleInputChange}
          />

          <h2 className="my-3 font-light -mx-2">Profile info</h2>
          <textarea
            className="p-1 bg-lightblue focus:bg-offwhite h-20 max-h-30 rounded-lg focus:outline-none focus:ring-0 shadow-lg my-2 text-darkergreen"
            name="profile_info"
            autoComplete="off"
            value={inputs.profile_info}
            onChange={handleInputChange}
            minLength={1}
            maxLength={100}
          />
        </div>
        <section className="flex flex-row items-center justify-center gap-2 m-auto">
          <button
            type="button"
            onClick={toggleEditProfile}
            className="bg-lightblue text-darkgreen p-1 px-2 rounded-4xl shadow-lg transform-all duration-300 ease-in-out hover:bg-offwhite cursor-pointer w-20 m-auto my-4 transform hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={doUpdate}
            className="bg-green text-offwhite p-1 px-2 rounded-4xl shadow-lg transform-all duration-300 ease-in-out hover:bg-darkergreen cursor-pointer w-20 m-auto my-4 transform hover:scale-105 active:scale-95"
          >
            Save
          </button>
        </section>
        <button
          type="button"
          onClick={doUserDelete}
          className="bg-lightblue text-darkgreen p-1 px-3 rounded-4xl shadow-lg transform-all duration-300 ease-in-out hover:bg-darkgreen hover:text-offwhite cursor-pointer m-auto my-4 transform hover:scale-105 active:scale-95"
        >
          Delete account
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
