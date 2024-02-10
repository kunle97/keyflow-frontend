import { authenticatedInstance } from "./api";
import { authUser } from "../constants";

//Create a function to get all notifications for a specific user using the endpoint /users/{user_id}/notifications/
export async function getNotifications() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.id}/notifications/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Notifications Error: ", error);
    return error.response;
  }
}
//Create a function to retrierve specific notification using the endpoint /notifications/{notification_id}/
export async function getNotification(notification_id) {
  try {
    const res = await authenticatedInstance
      .get(`/notifications/${notification_id}/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Notification Error: ", error);
    return error.response;
  }
}
//Create a function to label the notification as read by updatting the is_read field to true using the endpoint /notifications/{notification_id}/ ysing patch
export async function markNotificationAsRead(notification_id) {
  try {
    const res = await authenticatedInstance
      .patch(`/notifications/${notification_id}/`, { is_read: true })
      .then((res) => {
        console.log(res);
        return res;
      });
    return res;
  } catch (error) {
    console.log("Mark Notification As Read Error: ", error);
    return error.response;
  }
}
