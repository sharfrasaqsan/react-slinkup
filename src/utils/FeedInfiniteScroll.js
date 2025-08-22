import InfiniteScroll from "react-infinite-scroll-component";
import { useData } from "../contexts/DataContext";
import PostLoadingSpinner from "./PostLoadingSpinner";

const FeedInfiniteScroll = ({ posts, children }) => {
  const { fetchMorePosts, hasMore } = useData();
  return (
    <>
      <InfiniteScroll
        dataLength={posts?.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={<PostLoadingSpinner />}
        endMessage={<p className="text-center my-3">No more posts to load</p>}
      >
        {children}
      </InfiniteScroll>
    </>
  );
};

export default FeedInfiniteScroll;
