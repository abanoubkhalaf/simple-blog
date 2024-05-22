import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;
const GET_POSTS = `${API_URL}`;
const ADD_POST = `${API_URL}`;
const DELETE_POST = `${API_URL}`;
const UPDATE_POST = `${API_URL}`;

interface Post {
  id: string;
  title: string;
  body: string;
}

const getPostsQuery = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  try {
    const response = await axios.get(
      `${GET_POSTS}?_page=${page}&_limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error}`);
  }
};

const addPostMutation = async (data: Post) => {
  console.log(data);
  try {
    const response = await axios.post(ADD_POST, data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add post: ${error}`);
  }
};

const deletePost = async (id: string): Promise<Post> => {
  try {
    const response = await axios.delete(`${DELETE_POST}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete post ${error}`);
  }
};

const updatePostMutation = async (id: string, data: Post): Promise<Post> => {
  try {
    const response = await axios.put(`${UPDATE_POST}/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update post  ${error}`);
  }
};

export { getPostsQuery, addPostMutation, deletePost, updatePostMutation };
