import axios from "axios";
import { authUser, token } from "../constants";

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
    const response = await axios
      .post(
        "https://api.boldsign.com/v1/template/send",
        {
          roles: [
            {
              roleIndex: 1,
              signerName: data.tenant_first_name + " " + data.tenant_last_name,
              signerEmail: data.tenant_email,
            },
            {
              roleIndex: 2,
              signerName: authUser.first_name + " " + authUser.last_name,
              signerEmail: authUser.email,
            },
          ],
        },
        {
          params: {
            templateId: data.template_id,
          },
          headers: {
            accept: "application/json",
            "X-API-KEY": process.env.BOLDSIGN_API_KEY,
            "Content-Type":
              "application/json;odata.metadata=minimal;odata.streaming=true",
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
    const response = await axios.get(
      "https://api.boldsign.com/v1/document/getEmbeddedSignLink",
      {
        params: {
          documentId: data.document_id,
          signerEmail: data.tenant_email,
          redirectUrl: data.tenant_register_redirect_url,
          signLinkValidTill: data.link_valid_till, //Format: "10/14/2022"
        },
        headers: {
          accept: "application/json",
          "X-API-KEY": process.env.BOLDSIGN_API_KEY,
          "Content-Type":
            "application/json;odata.metadata=minimal;odata.streaming=true",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Generate Signing Link Error: ", error);
    return error.response;
  }
}
