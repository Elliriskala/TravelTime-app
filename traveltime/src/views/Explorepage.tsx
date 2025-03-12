import PostRow from '../components/PostRow';
import Selector from '../components/Selector';
import {useEffect, useState} from 'react';
import {useFollow, useTags, useUser} from '../hooks/apiHooks';
import {useTravelPosts} from '../hooks/apiHooks';
import {PostWithOwner} from '../types/LocalTypes';
import Post from './Post';

const Explorepage = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [destination, setDestination] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const {postArray, getPostsByDestination, getPostsByTag} = useTravelPosts();
  const [filteredPosts, setFilteredPosts] = useState<PostWithOwner[]>([]);
  const [selectPost, setSelectPost] = useState<PostWithOwner | undefined>(
    undefined,
  );
  const [openSelector, setOpenSelector] = useState<string | null>(null);
  const {getTags} = useTags();
  const {getUserByToken} = useUser();
  const {getFollowingsByUserId} = useFollow();

  // display all the posts
  useEffect(() => {
    setFilteredPosts(postArray);
  }, [postArray]);

  // get all the tags to the selector
  useEffect(() => {
    // fetch all the tags from the db
    const fetchTags = async () => {
      const allTags = await getTags();
      setTags(allTags.map((tag) => tag.tag_name));
    };
    fetchTags();
  }, []);

  // all destinations from the travelposts
  const destinations = Array.from(
    new Set(
      postArray.flatMap((post) => [post.continent, post.country, post.city]),
    ),
  );

  // use selector to sort and filter the posts
  useEffect(() => {
    const filterAndSortPosts = async () => {
      let filteredPosts = [...postArray];

      // filter the posts based on the selected category
      if (destination) {
        filteredPosts = await getPostsByDestination(destination);
        // by a tag
      } else if (selectedTag) {
        filteredPosts = await getPostsByTag(selectedTag);
        // all posts
      }

      // sort from newest to oldest
      if (sortBy === 'Newest') {
        filteredPosts.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      } else if (sortBy === 'Oldest') {
        // sort from oldest to newest
        filteredPosts.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
      } else if (sortBy === 'People you follow') {
        // sort by people you follow
        const token = localStorage.getItem('token');
        if (token) {
          // get the user id from the token
          const userResponse = await getUserByToken(token);
          const userId = userResponse.user.user_id;
          // fetch user followings with the user id
          const followings = await getFollowingsByUserId(userId);
          const followedUserIds = followings.map(
            (following) => following.following_id,
          );
          // display posts that people you follow has posted
          filteredPosts = filteredPosts.filter((post) =>
            followedUserIds.includes(post.user_id),
          );
        }
      }
      setFilteredPosts(filteredPosts);
    };

    filterAndSortPosts();
  }, [sortBy, destination, selectedTag]);

  // toggle the selector
  const toggleSelector = (selector: string) => {
    setOpenSelector(openSelector === selector ? null : selector);
  };

  return (
    <>
      {selectPost && <Post />}

      <div className="flex justify-center items-center my-5">
        <section className="text-darkblue flex items-center w-full sm:justify-between sm:w-full md:w-150 lg:max-w-200 flex-wrap">
          <Selector
            options={destinations}
            selected={destination}
            setSelected={setDestination}
            placeholder="Select destination"
            searchPlaceholder="city, country, continent"
            customStyles="w-full"
            isOpen={openSelector === 'destination'}
            toggleOpen={() => toggleSelector('destination')}
          />
          <Selector
            options={tags}
            selected={selectedTag}
            setSelected={setSelectedTag}
            placeholder="Select a tag"
            searchPlaceholder="search tags"
            customStyles="flex-2"
            isOpen={openSelector === 'tag'}
            toggleOpen={() => toggleSelector('tag')}
          />
          <Selector
            options={['Newest', 'Oldest', 'People you follow']}
            selected={sortBy}
            setSelected={setSortBy}
            placeholder="Sort by"
            searchPlaceholder=""
            hideSearch={true}
            customStyles="flex-2"
            isOpen={openSelector === 'sort'}
            toggleOpen={() => toggleSelector('sort')}
          />
        </section>
      </div>
      <section className="grid grid-cols-2 gap-3 sm:gap-5 m-auto w-full md:max-w-150 lg:max-w-220 lg:grid-cols-3 mt-2">
        {filteredPosts.map((post) => (
          <PostRow
            key={post.post_id}
            post={post}
            setSelectPost={setSelectPost}
          />
        ))}
      </section>
    </>
  );
};

export default Explorepage;
