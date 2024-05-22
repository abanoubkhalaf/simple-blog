import { Button } from "flowbite-react";

type PostItemProps = {
  post: {
    id: string;
    title: string;
    body: string;
  };
  removePostMutation: any;
  handleEdit: (post: any) => void;
};
function PostItem({ post, removePostMutation, handleEdit }: PostItemProps) {
  return (
    <div
      key={post.id}
      className="flex-grow w-10/12 p-6 text-white bg-white border border-gray-200 rounded-lg shadow md:w-6/12 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {post.title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {post.body}
      </p>
      <div className="flex items-center gap-3 mt-2">
        <Button onClick={() => handleEdit(post)} color="gray">
          Edit
        </Button>
        <Button onClick={() => removePostMutation.mutateAsync(post.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default PostItem;
