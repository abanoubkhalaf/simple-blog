import { useCallback, useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERIES } from "../../../helpers/consts";
import { deletePost, getPostsQuery } from "../_requests/BlogRequests";
import { Button, TextInput } from "flowbite-react";
import { debounce } from "lodash";

import CreateAndEditsForm from "../Components/CreateAndEditsForm";
import PostItem from "./PostItem";
const PostsList = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalValue, setModalValue] = useState("create");
  const [openModal, setOpenModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERIES.GET_POSTS],
    queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
      const response = getPostsQuery({ page: pageParam + 1, limit: 10 });
      return response;
    },
    getNextPageParam: (_, allPages) => {
      return allPages.length;
    },
    refetchOnWindowFocus: false,
    initialPageParam: 0,
  });
  const handleScroll = useCallback(() => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 200); // Debounce for other use cases (optional)
    window.addEventListener("scroll", debouncedHandleScroll);

    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, [handleScroll]);
  const queryClient = useQueryClient();

  const removePostMutation = useMutation({
    mutationFn: (id: string) => {
      return deletePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.GET_POSTS] });
    },
    onError: () => {
      console.log("Error");
    },
  });

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setOpenModal(true);
    setModalValue("edit");
  };
  const handleCreate = () => {
    setSelectedPost(null);
    setOpenModal(true);
    setModalValue("create");
  };
  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };
  const filterPosts = (data: any, searchQuery: string) => {
    if (!searchQuery) return data?.pages.flat();
    return data?.pages
      .flat()
      .filter(
        (post: any) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const filteredPosts = filterPosts(data, searchQuery);
  if (isError) {
    return <div>Error</div>;
  }
  if (isLoading) {
    return (
      <div
        role="status"
        className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
      >
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-950"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4 ">
      <Button onClick={handleCreate}>Add Post</Button>
      <TextInput
        type="text"
        value={searchQuery}
        onChange={(e: any) => handleSearchChange(e)}
        placeholder="Search..."
      />
      <CreateAndEditsForm
        setOpenModal={setOpenModal}
        openModal={openModal}
        modalValue={modalValue}
        selectedPost={selectedPost}
      />
      {filteredPosts?.length > 0 &&
        filteredPosts?.map((post: any) => (
          <PostItem
            key={post.id}
            post={post}
            removePostMutation={removePostMutation}
            handleEdit={handleEdit}
          />
        ))}
      {isFetchingNextPage && <div>loading more</div>}
    </div>
  );
};

export default PostsList;
