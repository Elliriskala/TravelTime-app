import {useState} from 'react';

const useForm = (callback: () => void, initState: Record<string, string>) => {
  const [inputs, setInputs] = useState(initState);

  const handleSubmit = (event: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    callback();
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event.persist();
    const {name, value} = event.target;
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
      // set the destination to be uppercase
      [name]: ['continent', 'country', 'city'].includes(name)
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value,
    }));
  };

  return {
    handleSubmit,
    handleInputChange,
    inputs,
    setInputs,
  };
};

export default useForm;
