import {ChangeEvent, useRef, useState} from 'react';
import {useFile, useTravelPosts} from '../hooks/apiHooks';
import useForm from '../hooks/formHooks';

// create a new post
const NewPostForm = ({ifUploadSuccess}: {ifUploadSuccess: () => void}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploadResult, setUploadResult] = useState<string>('');
  const {postFile} = useFile();
  const {postTravelPost} = useTravelPosts();

  // initial values
  const initValues: Record<string, string> = {
    continent: '',
    country: '',
    city: '',
    start_date: '',
    end_date: '',
    description: '',
    tags: '',
  };

  // handle file change
  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      setFile(evt.target.files[0]);
    }
  };

  // remove a added tag
  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
  };

  // handle tag input change
  const handleTagInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputs({...inputs, tags: evt.target.value});
  };

  // add a tag to the post
  const addTag = () => {
    if (
      inputs.tags &&
      !selectedTags.includes(inputs.tags) &&
      selectedTags.length < 3
    ) {
      // set the selected tags to the new post form
      setSelectedTags([...selectedTags, inputs.tags]);
      setInputs({...inputs, tags: ''});
    }
  };

  // upload a new post
  const doUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!file || !token) {
        setUploadResult('File or token is missing');
        return;
      }
      // upload the file to fileserver and post metadata to media api server
      const fileResult = await postFile(file, token);
      // post the post with tags
      await postTravelPost(
        fileResult,
        {...inputs, tags: selectedTags.join(',')}, // Ensure tags are included
        token,
      );

      setUploadResult(uploadResult);
      // if success go to userprofile
      ifUploadSuccess();
    } catch (e) {
      setUploadResult((e as Error).message);
    }
  };

  const {handleSubmit, handleInputChange, inputs, setInputs} = useForm(
    doUpload,
    initValues,
  );

  // reset the form
  const resetForm = () => {
    setInputs(initValues);
    setFile(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
    setSelectedTags([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-t from-transparent-blue to-blue rounded-lg shadow-xl p-3 w-full sm:w-4/5 md:w-3/5 md:max-w-140 mt-7 m-auto text-darkergreen flex flex-col items-center"
    >
      <div className=" flex flex-col p-2">
        <label htmlFor="file"></label>
        <input
          className="hidden"
          name="file"
          type="file"
          id="file"
          accept="image/*, video/*"
          onChange={handleFileChange}
          ref={fileRef}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="bg-lightblue text-darkergreen shadow-xl text-center p-2 rounded-xl transform-all duration-300 ease-in-out hover:bg-offwhite cursor-pointer w-50 justify-center m-auto my-4 transform hover:scale-105 active:scale-95"
        >
          + Add a picture/video
        </button>
      </div>
      {file && file.type.includes('video/mp4') ? (
        <video
          src={URL.createObjectURL(file)}
          id='video-preview'
          className="w-60 h-60 md:w-80 md:h-80 bg-lightblue my-6 shadow-lg justify-center items-center m-auto object-cover
          "
        />
      ) : (
        file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-60 h-60 md:w-80 md:h-80 bg-lightblue my-6 shadow-lg justify-center items-center m-auto object-cover
          "
          />
        )
      )}
      <div className="flex sm:max-w-100 flex-col w-full">
        <h2 className="font-light mb-4 mx-6">Destination:</h2>
        <p className="mx-8 font-bold ">Continent</p>
        <input
          type="text"
          className="p-1 bg-lightblue focus:bg-offwhite rounded-lg focus:outline-none focus:ring-0 shadow-lg m-auto my-2 mx-8 text-darkergreen"
          required
          name="continent"
          minLength={3}
          maxLength={30}
          value={inputs.continent}
          onChange={handleInputChange}
        />
        <p className="mx-8 font-bold ">Country</p>
        <input
          type="text"
          className="p-1 bg-lightblue focus:bg-offwhite rounded-lg focus:outline-none focus:ring-0 shadow-lg m-auto my-2 mx-8 text-darkergreen"
          required
          name="country"
          minLength={3}
          maxLength={30}
          value={inputs.country}
          onChange={handleInputChange}
        />
        <p className="mx-8 font-bold ">City</p>
        <input
          type="text"
          className="p-1 bg-lightblue focus:bg-offwhite rounded-lg focus:outline-none focus:ring-0 shadow-lg m-auto my-2 mx-8 text-darkergreen"
          required
          name="city"
          minLength={1}
          maxLength={30}
          value={inputs.city}
          onChange={handleInputChange}
        />
      </div>
      <section className="flex sm:max-w-100 flex-col w-full">
        <h2 className="font-light my-4 mx-6">Date of the trip:</h2>
        <div className="flex flex-row flex-wrap mb-2 ml-8 gap-3">
          <div className="">
            <p className="font-bold">Start date</p>
            <input
              type="date"
              name="start_date"
              value={inputs.start_date}
              onChange={handleInputChange}
              className="p-1 bg-lightblue focus:bg-offwhite rounded-lg focus:outline-none focus:ring-0 shadow-lg m-auto my-2 max-w-50 cursor-pointer text-darkergreen"
              required
            />
          </div>
          <div className="">
            <p className="font-bold">End date</p>
            <input
              type="date"
              name="end_date"
              value={inputs.end_date}
              onChange={handleInputChange}
              className="p-1 bg-lightblue focus:bg-offwhite rounded-lg focus:outline-none focus:ring-0 shadow-lg m-auto my-2 max-w-50 cursor-pointer text-darkergreen"
              required
            />
          </div>
        </div>
      </section>
      <section className="flex sm:max-w-100 flex-col w-full">
        <h2 className="font-light my-4 mx-6">Tags:</h2>
        <div>
          <input
            type="text"
            name="tags"
            minLength={1}
            maxLength={30}
            value={inputs.tags}
            onChange={handleTagInputChange}
            className="p-1 bg-lightblue focus:bg-offwhite rounded-lg focus:outline-none focus:ring-0 shadow-lg my-2 text-darkergreen ml-8 max-w-40 sm:max-w-90"
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-lightblue text-darkgreen shadow-xl text-center px-3 py-1 rounded-4xl transform-all duration-300 ease-in-out hover:bg-offwhite cursor-pointer transform hover:scale-105 active:scale-95 font-light mx-2"
          >
            Add
          </button>

          <div className="mx-8 my-2 flex">
            {selectedTags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-lightblue p-1 px-3 rounded-lg shadow-lg text-darkergreen"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 text-darkgreen hover:text-darkergreen cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="flex sm:max-w-100 flex-col w-full mt-4">
        <h2 className="font-light mb-4 mx-6">Description:</h2>
        <textarea
          className="p-1 bg-lightblue focus:bg-offwhite h-20 max-h-30 rounded-lg focus:outline-none focus:ring-0 shadow-lg m-auto my-2 mx-8 text-darkergreen"
          required
          name="description"
          value={inputs.description}
          onChange={handleInputChange}
          minLength={1}
          maxLength={400}
        />
      </div>
      <div className="flex flex-row my-4 m-auto justify-center gap-4">
        <button
          type="submit"
          className="bg-darkgreen text-offwhite shadow-xl text-center p-1 rounded-4xl transform-all duration-300 ease-in-out hover:bg-darkergreen cursor-pointer w-20 font-bold transform hover:scale-105 active:scale-95"
        >
          Post
        </button>
        <button
          type="reset"
          onClick={resetForm}
          className="bg-lightblue text-darkgreen shadow-xl text-center p-1 rounded-4xl transform-all duration-300 ease-in-out hover:bg-lightred hover:bg-offwhite cursor-pointer w-20 font-bold transform hover:scale-105 active:scale-95"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default NewPostForm;
