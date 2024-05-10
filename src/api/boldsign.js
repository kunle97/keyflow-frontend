import axios from "axios";
import { authUser, token } from "../constants";
import { authenticatedInstance, unauthenticatedInstance } from "./api";

//Create a function that calls on the /boldsign/create-embedded-template-create-link/ endpoint to create a new embedded template link.
export async function createBoldSignEmbeddedTemplateLink(data) {
  try {
    const res = await axios
      .post(
        `${process.env.REACT_APP_API_HOSTNAME}/boldsign/create-embedded-template-create-link/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Create Embedded Template Link Error: ", error);
    return error.response;
  }
}

//Create a function that calls the /boldsign/create-embedded-template-edit-link/ endpoint to create a new embedded template edit link.
export async function createBoldSignEmbeddedTemplateEditLink(data) {
  try {
    const res = await axios
      .post(
        `${process.env.REACT_APP_API_HOSTNAME}/boldsign/create-embedded-template-edit-link/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Create Embedded Template Edit Link Error: ", error);
    return error.response;
  }
}
//Create a function that calls the  api/boldsign/create-embedded-document-send-link/ endpoint to create a new embedded document send link.
export async function createBoldSignEmbeddedDocumentSendLink(data) {
  try {
    const res = await axios
      .post(
        `${process.env.REACT_APP_API_HOSTNAME}/boldsign/create-embedded-document-send-link/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Create Embedded Document Send Link Error: ", error);
    return error.response;
  }
}

//Create a a function to send a document to a user
export async function sendDocumentToUser(data) {
  try {
    const response = await authenticatedInstance
      .post(
        `${process.env.REACT_APP_API_HOSTNAME}/boldsign/create-document-from-template/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return response;
  } catch (error) {
    console.error("Send Document to User Error: ", error);
    return error.response;
  }
}

//Create a function to generate a siging link using an axios get request and a documentId parameter with is url   'https://api.boldsign.com/v1/document/getEmbeddedSignLink?documentId=17882g56-6686-46d9-dhg3-ce5737751234&signerEmail=alexgayle@cubeflakes.com&redirectUrl=https://www.syncfusion.com/&signLinkValidTill=10/14/2022'
export async function generateSigningLink(data) {
  try {
    const response = await unauthenticatedInstance
      .post(
        `${process.env.REACT_APP_API_HOSTNAME}/boldsign/create-signing-link/`,
        data
      )
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return { data: response };
  } catch (error) {
    console.error("Generate Signing Link Error: ", error);
    return error.response;
  }
}

//Create a function that donwloads a doccument using the url  https://api.boldsign.com/v1/document/download and params documentId
export async function downloadBoldSignDocument(document_id) {
  try {
    const response = await authenticatedInstance.post(
      `/boldsign/download-document/`,
      { document_id: document_id }
    );
    return { data: response, status: 200 };
  } catch (error) {
    console.error("Download Document Error: ", error);
    return error.response;
  }
}
