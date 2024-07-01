import React, { useEffect } from "react";
import { useParams } from "react-router";
import {
  getNotification,
  markNotificationAsRead,
} from "../../../api/notifications";
import { useState } from "react";
import BackButton from "../UIComponents/BackButton";
import { uiGreen, uiGrey2 } from "../../../constants";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { removeUnderscoresAndCapitalize } from "../../../helpers/utils";
export const NotificationDetail = () => {
  const { id } = useParams();
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    timestamp: "",
  }); //initialize notification state
  useEffect(() => {
    //retrieve notification by id from api
    getNotification(id)
      .then((res) => {
        console.log("Notification Resposne ", res);
        setNotification(res);
      })
      .catch((error) => {
        console.error("Error fetching notification", error);
      });

    //Mark notification as read
    markNotificationAsRead(id)
      .then((res) => {
        console.log("Marked as read", res);
      })
      .catch((error) => {
        console.error("Error marking as read", error);
      });
  }, []);
  return (
    <div>
      <div className="row">
        {" "}
        <div className="col-md-5  offset-md-3">
          <BackButton to="/dashboard/notifications" />
          <div className="card">
            {/* <center className="py-4 mt-3">
              <NotificationsNoneOutlinedIcon
                style={{ fontSize: 50, color: uiGreen, marginBottom: 12 }}
              />
            </center> */}
            <div className="card-body">
              <div className="row">
                <div className="col-md-12 mb-3">
                  <p
                    className="text-black"
                    style={{ fontSize: "14pt", color: uiGrey2 }}
                  >
                    <strong>Message:</strong>
                  </p>{" "}
                  <span style={{ color: uiGrey2 }}>{notification.message}</span>
                </div>
                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto" }}
                >
                  <span
                    style={{ float: "left", fontSize: "14pt", color: uiGrey2 }}
                  >
                    <strong>Type</strong>
                  </span>{" "}
                  <span style={{ float: "right", color: uiGrey2 }}>
                    {removeUnderscoresAndCapitalize(notification.type)}
                  </span>
                </div>
                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto" }}
                >
                  <span
                    style={{ float: "left", fontSize: "14pt", color: uiGrey2 }}
                  >
                    <strong>Date</strong>{" "}
                  </span>
                  <span style={{ float: "right", color: uiGrey2 }}>
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
