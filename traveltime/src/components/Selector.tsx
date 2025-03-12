import {BiChevronDown, BiChevronUp} from 'react-icons/bi';
import {useState} from 'react';
import {AiOutlineSearch} from 'react-icons/ai';

interface SelectorProps {
  options: string[];
  selected: string;
  setSelected: (selected: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  hideSearch?: boolean;
  customStyles?: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

// selector to filter posts by destination/tags
const Selector = ({
  options,
  selected,
  setSelected,
  placeholder,
  searchPlaceholder,
  hideSearch = false,
  customStyles = '',
  isOpen,
  toggleOpen,
}: SelectorProps) => {
  const [input, setInput] = useState('');

  return (
    <div className={`relative m-1 ${customStyles}`}>
      <div
        onClick={toggleOpen}
        className="bg-gradient-to-b from-green to-darkgreen w-full p-2 flex items-center justify-between rounded-lg cursor-pointer text-offwhite"
      >
        {selected ? selected : placeholder}
        {isOpen ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
      </div>
      <ul
        className={`bg-lightblue overflow-y-auto absolute z-40 w-full text-darkgreen rounded-lg shadow-lg mt-1
        ${isOpen ? 'max-h-60' : 'hidden'}`}
      >
        {!hideSearch && (
          <div className="flex items-center px-2 border-b-1 border-transparent-blue top-0 z-50 sticky bg-offwhite ">
            <AiOutlineSearch size={20} className=" text-darkblue" />
            <input
              type="text"
              value={input}
              onChange={(evt) => setInput(evt.target.value.toLocaleLowerCase())}
              placeholder={searchPlaceholder}
              className="p-2 w-full bg-white border-0 focus:outline-none focus:ring-0"
            />
          </div>
        )}
        <li
          className={`p-2 py-3 text-sm transition-all duration-300 ease-in-out hover:bg-transparent-blue cursor-pointer
            ${selected === '' && 'bg-blue'}`}
          onClick={() => {
            setSelected('');
            toggleOpen();
            setInput('');
          }}
        >
          none
        </li>

        {options.map((option) => (
          <li
            key={option}
            className={`p-2 py-3 text-sm transition-all duration-300 ease-in-out hover:bg-transparent-blue cursor-pointer
              ${option.toLocaleLowerCase() === selected.toLocaleLowerCase() && 'bg-blue'}

              ${option.toLocaleLowerCase().startsWith(input) ? '' : 'hidden'}`}
            onClick={() => {
              if (option.toLocaleLowerCase() !== selected.toLocaleLowerCase()) {
                setSelected(option);
                toggleOpen();
                setInput('');
              }
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Selector;
