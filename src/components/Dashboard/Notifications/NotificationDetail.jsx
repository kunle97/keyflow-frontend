import React, { useEffect } from "react";
import { useParams } from "react-router";
import { getNotification, markNotificationAsRead } from "../../../api/notifications";
import { useState } from "react";
import BackButton from "../UIComponents/BackButton";
import { uiGreen } from "../../../constants";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
export const NotificationDetail = () => {
  const { id } = useParams();
  const [notification, setNotification] = useState({}); //initialize notification state
  useEffect(() => {
    //retrieve notification by id from api
    getNotification(id).then((res) => {
      console.log("Notification Resposne ", res);
      setNotification(res);
    });

    //Mark notification as read
    markNotificationAsRead(id).then((res) => {
      console.log("Marked as read", res);
    });
  }, []);
  return (
    <div>
      <div className="row">
        {" "}
        <div className="col-md-5  offset-md-3">
          <BackButton to="/dashboard/landlord/notifications" />
          <div className="card">
            {/* <center className="py-4 mt-3">
              <NotificationsNoneOutlinedIcon
                style={{ fontSize: 50, color: uiGreen, marginBottom: 12 }}
              />
            </center> */}
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <p>
                    <strong>Message:</strong>
                  </p>{" "}
                  {notification.message}
                </div>
                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto" }}
                >
                  <span style={{ float: "left", fontSize: "14pt" }}>
                    <strong>Type</strong>
                  </span>{" "}
                  <span style={{ float: "right" }}>{notification.type}</span>
                </div>
                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto" }}
                >
                  <span style={{ float: "left", fontSize: "14pt" }}>
                    <strong>Date</strong>{" "}
                  </span>
                  <span style={{ float: "right" }}>
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
