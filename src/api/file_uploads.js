import axios from "axios";
import { authenticatedMediaInstance } from "./api";

//Create a function uploadFile that takes a data payload as a parameter and returns response from sever. Endpoint is /file_uploads
export const uploadFile = async (data) => {
  try {
    const response = await authenticatedMediaInstance.post(
      "/file-uploads/",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
