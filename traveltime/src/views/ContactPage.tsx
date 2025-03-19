import {MdConnectWithoutContact, MdOutlineContactSupport} from 'react-icons/md';
import BackButton from '../components/BackButton';
import {SlGlobe} from 'react-icons/sl';
import {FaRegLightbulb} from 'react-icons/fa';
import {RiUserHeartLine} from 'react-icons/ri';

const Contact = () => {
  return (
    <div className="bg-gradient-to-t from-green to-blue w-full sm:w-4/5 md:w-3/5 md:max-w-140 m-auto mt-14 shadow-lg text-darkergreen z-10 flex gap-2 relative rounded-lg p-2 flex-col">
      <div className="absolute left-0 top-0 z-30 -mt-14 -mx-2">
        <BackButton />
      </div>
      <section className="flex flex-row items-center justify-center mt-6 p-2 gap-1 font-bold">
        <MdOutlineContactSupport size={25} />
        <h1 className="mr-2">Contact</h1>
      </section>
      <section className="p-2 text-center text-darkergreen px-10">
        <p className="pb-4">
          If you have questions, run into issues, or need assistance using
          TravelTime, we are here for you.
        </p>
        <p className="font-bold">Email: admin@traveltime.com</p>
      </section>
      <section className="p-2 text-darkergreen m-auto">
        <h2 className=" text-center mb-6 mt-2">Why TravelTime?</h2>
        <section className="flex flex-col gap-1 justify-center mx-10 sm:mx-20">
          <p className="flex flex-row items-center gap-2">
            <SlGlobe size={18} />
            <b>Discover hidden gems</b>
          </p>
          <p className="mx-8 mb-4">
            Unique destinations and tips from other travelers.
          </p>
          <p className="flex flex-row items-center gap-2">
            <FaRegLightbulb size={20} />
            <b>Get Inspired</b>
          </p>
          <p className="mx-8 mb-4">Stories, photos, and ideas.</p>

          <p className="flex flex-row items-center gap-2">
            <MdConnectWithoutContact size={20} />
            <b>Connect Globally</b>
          </p>
          <p className="mx-8 mb-4">
            Interact and exchange ideas with like-minded travelers.
          </p>

          <p className="flex flex-row items-center gap-2">
            <RiUserHeartLine size={20} />
            <b>Support Each Other</b>
          </p>
          <p className="mx-8 mb-4">
            Share advice, ask questions, and help others.
          </p>
        </section>
      </section>
        <img
          src="/~ellinor/travelTime/svg/logo-no-background.svg"
          alt="TravelTime logo"
          className="object-cover w-25 h-15 m-auto my-4"
        />
    </div>
  );
};

export default Contact;
