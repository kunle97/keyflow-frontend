import axios from "axios";
import {
  authenticatedMediaInstance,
  authenticatedInstance,
  unauthenticatedInstance,
} from "./api";

//Create a function uploadFile that takes a data payload as a parameter and returns response from sever. Endpoint is /file_uploads
export const uploadFile = async (data) => {
  try {
    const response = await authenticatedMediaInstance.post(
      "/file-uploads/",
      data
    );
    return response;
  } catch (error) {
    console.log("Upload file Error: ", error);
    return { response: error.response, message: error.response.data.message, status: error.response.status };
  }
};

//Create a function retrievePresignedURL that makes a post request tothe end point  /file-uploads/presigned-url/  with a payload containing a file_key.
export const retrievePresignedURL = async (file_key) => {
  try {
    const response = await authenticatedInstance.post(
      "/retrieve-presigned-url/",
      {
        file_key: file_key,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

//Create a function to delted uplaoaded Files
export const deleteFile = async (data) => {
  try {
    const response = await authenticatedInstance.post(`/s3-file-delete/`, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

//Creatye a function to retrieve all uploaded files by thier subtype using te endpoint format `/file-uploads/?subfolder={subfolder}`
export const retrieveFilesBySubfolder = async (subfolder, user_id) => {
  try {
    const response = await authenticatedInstance.get("/file-uploads/", {
      params: {
        subfolder: subfolder,
        user_id: user_id,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  } 
};

//Create a function that uses the unauthenticated instance to retrieve files by subfolder using a post to the endpoint /retrieve-images-by-subfolder/
export const retrieveUnauthenticatedFilesBySubfolder = async (subfolder) => {
  try {
    const response = await unauthenticatedInstance.post(
      `/retrieve-images-by-subfolder/`,
      {
        subfolder: subfolder,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
