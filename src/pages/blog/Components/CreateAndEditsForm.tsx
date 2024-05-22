import { Button, Modal, TextInput, Textarea } from "flowbite-react";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import React from "react";
import { addPostMutation, updatePostMutation } from "../_requests/BlogRequests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "../../../helpers/consts";
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  body: Yup.string().required("Body is required"),
});
type CreateAndEditsFormProps = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
  modalValue: string;
  selectedPost: any;
};
function CreateAndEditsForm({
  setOpenModal,
  openModal,
  modalValue,
  selectedPost,
}: CreateAndEditsFormProps) {
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (data: any) => {
      return addPostMutation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.GET_POSTS] });
    },
    onError: () => {
      console.log("Error");
    },
  });
  const EditPostMutation = useMutation({
    mutationFn: (data: any) => {
      return updatePostMutation(selectedPost.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.GET_POSTS] });
    },
    onError: () => {
      console.log("Error");
    },
  });
  const handleSubmit = async (
    values: any,
    { resetForm }: FormikHelpers<any>
  ) => {
    if (modalValue === "create") {
      try {
        await createPostMutation.mutateAsync(values);
        setOpenModal(false);
        resetForm();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await EditPostMutation.mutateAsync(values);
        setOpenModal(false);
        resetForm();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Create New Post</Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              title: (selectedPost?.title && selectedPost?.title) || "",
              body: (selectedPost?.body && selectedPost?.body) || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              resetForm,
              values,
              handleChange,
              handleBlur,
            }) => (
              <Form>
                <div className="mb-2">
                  <label>Title:</label>
                  <TextInput
                    type="text"
                    name="title"
                    required
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage name="title" component="div" />
                </div>
                <div>
                  <label>Body:</label>
                  <Textarea
                    name="body"
                    required
                    value={values.body}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage name="body" component="div" />
                </div>
                <Modal.Footer className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    Create
                  </Button>
                  <Button
                    color="gray"
                    onClick={() => {
                      setOpenModal(false);
                      resetForm();
                    }}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateAndEditsForm;
