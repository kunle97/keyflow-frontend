import { authenticatedInstance, unauthenticatedInstance, authenticatedMediaInstance } from "./api";
import { authUser } from "../constants";

//Create a function to get all messages for this user
export async function getMessages() {
  try {
    const res = await authenticatedInstance.get(`/messages/`).then((res) => {
      if (res.status == 200 && res.data.length == 0) {
        return { data: [] };
      }
      return { data: res.data };
    });
    return res;
  } catch (error) {
    console.log("Get Messages Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}
//Create a function to get all messages for this user
export async function getMessagesWithLimit(limit) {
  try {
    const res = await authenticatedInstance
      .get(`/messages/?limit=${limit}`)
      .then((res) => {
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Messages Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to get a message by a specific recipient id
export async function getMessageByRecipient() {
  try {
    const res = await authenticatedInstance
      .get(`/messages/?recipient=${authUser.id}`)
      .then((res) => {
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Message By Recipient Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to send a message to a user
export async function sendMessage(data) {
  try {
    const res = await authenticatedMediaInstance
      .post(`/messages/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios send message response ", response);
        return response;
      });
    return { message: "Message sent successfully", status: 200, res: res };
  } catch (error) {
    console.log("Send Message Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to edit a message
export async function editMessage(data) {
  try {
    const res = await authenticatedInstance
      .patch(`/messages/`, {
        data,
      })
      .then((res) => {
        const response = res.data;
        console.log("axios edit message response ", response);
        return response;
      });
    return { message: "Message edited successfully", status: 200, res: res };
  } catch (error) {
    console.log("Edit Message Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to delete a message
export async function deleteMessage(data) {
  try {
    const res = await authenticatedInstance
      .delete(`/messages/`, {
        data,
      })
      .then((res) => {
        const response = res.data;
        console.log("axios delete message response ", response);
        return response;
      });
    return { message: "Message deleted successfully", status: 200, res: res };
  } catch (error) {
    console.log("Delete Message Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to retrieve the users message threads /retrieve-user-threads/ using a get request
export async function retrieveUserThreads() {
  try {
    const res = await authenticatedInstance
      .get(`/retrieve-user-threads/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Messages Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function that retrieve the users unread messages count using the endpoint GET: messages/retrieve-unread-messages-count/ using a get request
export async function retrieveUnreadMessagesCount() {
  try {
    const res = await authenticatedInstance
      .get(`/messages/retrieve-unread-messages-count/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Messages Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create  a function that sets a message as read using the endpoint PATCH: messages/set-message-as-read/ using a patch request
export async function setMessageThreadAsRead(data) {
  try {
    const res = await authenticatedInstance
      .patch(`/messages/set-messages-thread-as-read/`, data)
      .then((res) => {
        console.log(res);
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Messages Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

