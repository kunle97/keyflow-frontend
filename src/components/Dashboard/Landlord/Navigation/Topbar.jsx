import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { authenticatedInstance } from "../../../../api/api";
import { logout } from "../../../../api/auth";
import { redirect, useNavigate } from "react-router";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { Link } from "react-router-dom";
import {
  authUser,
  dateDiffForHumans,
  defaultWhiteInputStyle,
  token,
  uiGreen,
  uiGrey1,
  uiGrey2,
  uiGrey3,
  uiRed,
} from "../../../../constants";
import { faker } from "@faker-js/faker";
import { getMessagesWithLimit, getMessages } from "../../../../api/messages";
import { createThreads } from "../../../../helpers/messageUtils";
import { IconButton, Stack } from "@mui/material";
import { retrieveFilesBySubfolder } from "../../../../api/file_uploads";
import SearchIcon from "@mui/icons-material/Search";
import SearchDialog from "../../UIComponents/Modals/Search/SearchDialog";
const Topbar = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [profilePictures, setProfilePictures] = useState(null);
  const [messageThreads, setMessageThreads] = useState([]);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { logoutUser } = useAuth();
  const searchBarStyle = {
    ...defaultWhiteInputStyle,
    borderRadius: "40px",
    border: "none",
    outline: "none",
    boxShadow: "none",
    background: "#f4f7f8",
    padding: "10px 20px",
    width: "260px",
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    logoutUser();
  };
  const fetchMessages = () => {
    getMessages().then((res) => {
      // Use the messages to create threads
      let threads = createThreads(res.data);
      //Filter the threads variable to show 5 threads with the most recent messages
      threads = threads.slice(0, 5);
      setMessageThreads(threads);
    });
  };
  const getProfilePicture = async (user_id) => {
    try {
      const res = await retrieveFilesBySubfolder(
        "user_profile_picture",
        user_id
      );

      if (res.status === 200 && res.data[0].file) {
        return res.data[0].file;
      } else {
        return "/assets/img/avatars/default-user-profile-picture.png";
      }
    } catch (error) {
      console.log(error);
      return "/assets/img/avatars/default-user-profile-picture.png";
    }
  };
  const fetchProfilePictures = async () => {
    const pictures = {};
    for (const thread of messageThreads || []) {
      const user_id = thread.recipient_id;
      const picture = await getProfilePicture(user_id);
      pictures[user_id] = picture;
    }
    setProfilePictures(pictures);
  };
  //REtrieve user notifications
  useEffect(() => {
    try {
      authenticatedInstance
        .get("/notifications/?limit=5&ordering=-timestamp")
        .then((response) => {
          setNotifications(response.data.results);
          setNotificationCount(response.data.count);
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
      fetchMessages();
      retrieveFilesBySubfolder("user_profile_picture", authUser.user_id).then(
        (res) => {
          setProfilePictureFile(res.data[0]);
        }
      );
      if (!profilePictures) {
        fetchProfilePictures();
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Done");
    }
  }, [profilePictures]);
  return (
    <div className="container">
      {open && (
        <AlertModal
          open={true}
          onClose={() => setOpen(false)}
          title={"Logout Successful!"}
          message="You have been logged Out Successfully! Click the link below to  return to the home page"
          btnText="Return Home"
          to={
            authUser.account_type === "landlord"
              ? "/dashboard/landlord/login"
              : "/dashboard/tenant/login"
          }
        />
      )}
      <nav
        className="navbar navbar-expand shadow mb-4 topbar static-top navbar-light"
        style={{
          background: "white",
          boxShadow:
            "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23) !important",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <div className="container">
          {showSearchMenu && (
            <SearchDialog
              open={showSearchMenu}
              handleClose={() => setShowSearchMenu(false)}
              query={searchQuery}
            />
          )}
          <Link className="navbar-brand" to="/dashboard/landlord">
            <img
              src="/assets/img/key-flow-logo-black-transparent.png"
              style={{ height: "40px", width: "auto" }}
            />
          </Link>
          <button
            className="btn btn-link d-md-none rounded-circle me-3"
            id="sidebarToggleTop"
            type="button"
          >
            <i className="fas fa-bars" />
          </button>
          <form className="d-none d-sm-inline-block me-auto ms-md-3 my-2 my-md-0 mw-100 navbar-search">
            <div className="input-group"></div>
          </form>
          {authUser.account_type === "landlord" && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              justifyContent="space-between"
            >
              <input
                type="search"
                placeholder="Search"
                style={searchBarStyle}
                value={searchQuery}
                onChange={(e) => {
                  setShowSearchMenu(true);
                  setSearchQuery(e.target.value);
                }}
              />
              <IconButton
                style={{
                  background: uiGreen,
                  position: "absolute",
                  right: "302px",
                }}
                onClick={() => setShowSearchMenu(true)}
              >
                <SearchIcon style={{ color: "white" }} />
              </IconButton>
            </Stack>
          )}
          <ul className="navbar-nav flex-nowrap">
            <li className="nav-item dropdown d-sm-none no-arrow">
              <a
                className="dropdown-toggle nav-link"
                aria-expanded="false"
                data-bs-toggle="dropdown"
                href="#"
              >
                <i className="fas fa-search" />
              </a>
              <div
                className="dropdown-menu dropdown-menu-end p-3 animated--grow-in"
                aria-labelledby="searchDropdown"
              >
                <form className="me-auto navbar-search w-100">
                  <div className="input-group">
                    <input
                      className="bg-light form-control border-0 small"
                      type="text"
                      placeholder="Search for ..."
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary py-0" type="button">
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>
            <li className="nav-item dropdown no-arrow mx-1">
              <div className="nav-item dropdown no-arrow">
                <a
                  className="dropdown-toggle nav-link"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  href="#"
                >
                  {" "}
                  {notifications.filter((notification) => !notification.is_read)
                    .length > 0 && (
                    <span className="badge bg-danger badge-counter">
                      {notifications.length}
                    </span>
                  )}
                  <i className="fas fa-bell fa-fw" />
                </a>
                <div className="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in">
                  <h5
                    className="dropdown-header"
                    style={{
                      background: uiGreen,
                      borderStyle: "none",
                      textTransform: "none !important",
                      fontSize: "14pt",
                    }}
                  >
                    Notifications
                  </h5>
                  {notifications.length === 0 ? (
                    <center>
                      <span
                        style={{
                          borderStyle: "none",
                          fontSize: "12pt",
                          color: "grey",
                          margin: "30px 0",
                        }}
                      >
                        You have no new notifications
                      </span>
                    </center>
                  ) : (
                    <>
                      {notifications.map((notification) => (
                        <a
                          className="dropdown-item d-flex align-items-center"
                          href={`/dashboard/landlord/notifications/${notification.id}`}
                          style={
                            notification.is_read
                              ? {
                                  background: uiGrey2,
                                  color: "white",
                                  border: "none",
                                }
                              : {
                                  background: uiGrey1,
                                  border: "none",
                                  color: "white",
                                }
                          }
                        >
                          <div className="me-3">
                            <div className="bg-primary icon-circle">
                              <i className="fas fa-donate text-white" />
                            </div>
                          </div>
                          <div>
                            <span className="small ">
                              {new Date(
                                notification.timestamp
                              ).toLocaleDateString()}
                            </span>
                            {notification.type === "message" ? (
                              <p>{notification.title}</p>
                            ) : (
                              <p>{notification.message}</p>
                            )}
                          </div>{" "}
                        </a>
                      ))}
                    </>
                  )}
                  <Link
                    className="dropdown-item text-center large"
                    to="/dashboard/landlord/notifications"
                    style={{
                      borderStyle: "none",
                      background: uiGreen,
                      color: "white",
                      fontSize: "12pt",
                    }}
                  >
                    All Notifications
                  </Link>
                </div>
              </div>
            </li>
            <li className="nav-item dropdown no-arrow mx-1">
              <div className="nav-item dropdown no-arrow">
                <a
                  className="dropdown-toggle nav-link"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  href="#"
                >
                  <span className="badge bg-danger badge-counter">7</span>
                  <i className="fas fa-envelope fa-fw" />
                </a>
                <div
                  className="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in"
                  style={{ borderStyle: "none" }}
                >
                  <h5
                    className="dropdown-header"
                    style={{
                      background: uiGreen,
                      borderStyle: "none",
                      textTransform: "none !important",
                      fontSize: "14pt",
                    }}
                  >
                    Messages
                  </h5>

                  {messageThreads.length === 0 ? (
                    <center>
                      <span
                        style={{
                          borderStyle: "none",
                          fontSize: "12pt",
                          color: "grey",
                          margin: "30px 0",
                        }}
                      >
                        You have no new messages
                      </span>
                    </center>
                  ) : (
                    <ul className="list-group ">
                      {messageThreads.map((thread) => {
                        const profilePic =
                          profilePictures[thread.recipient_id] ||
                          "/assets/img/avatars/default-user-profile-picture.png";
                        return (
                          <li
                            key={thread.id}
                            className={`list-group-item`}
                            style={{
                              backgroundColor: uiGrey2,
                              color: "white",
                              border: "none",
                              borderRadius: "0",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              const redirectLink = `/dashboard/messages/${thread.name}`;
                              //Use window.location.href to redirect to the thread
                              window.location.href = redirectLink;
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <div
                                style={{
                                  borderRadius: "50%",
                                  overflow: "hidden",
                                  width: "65px",
                                  height: "50px",
                                }}
                              >
                                <img
                                  style={{ height: "100%", margin: "0 auto" }}
                                  src={profilePic}
                                />
                              </div>
                              <Stack
                                sx={{ width: "100%" }}
                                direction="column"
                                spacing={0}
                              >
                                <Stack
                                  sx={{ width: "100%" }}
                                  direction="row"
                                  alignItems="center"
                                  spacing={0}
                                  justifyContent="space-between"
                                >
                                  <span style={{ fontSize: "16pt" }}>
                                    {thread.name}
                                  </span>{" "}
                                  <span className="text-white">
                                    {dateDiffForHumans(
                                      new Date(thread.messages[0].timestamp)
                                    )}
                                  </span>
                                </Stack>
                                <Stack
                                  sx={{ width: "100%", marginTop: "5px" }}
                                  direction="row"
                                  alignItems="center"
                                  spacing={0}
                                  justifyContent="space-between"
                                >
                                  <span
                                    className="text-white"
                                    style={{
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      maxWidth: "175px", // Adjust the width to accommodate the other span's width
                                    }}
                                  >
                                    {thread.messages[0].text}
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: uiRed,
                                      color: "white",
                                      borderRadius: "20%",
                                      padding: "0 5px",
                                    }}
                                  >
                                    {thread.messages.length}
                                  </span>
                                </Stack>
                              </Stack>
                            </Stack>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <Link
                    className="dropdown-item text-center small"
                    to="/dashboard/messages"
                    style={{
                      borderStyle: "none",
                      background: uiGreen,
                      color: "white",
                      fontSize: "12pt",
                    }}
                  >
                    All Messages
                  </Link>
                </div>
              </div>
              <div
                className="shadow dropdown-list dropdown-menu dropdown-menu-end"
                aria-labelledby="alertsDropdown"
              />
            </li>
            <div className="d-none d-sm-block topbar-divider" />
            <li className="nav-item dropdown no-arrow">
              <div className="nav-item dropdown no-arrow">
                <a
                  className="dropdown-toggle nav-link"
                  aria-expanded="true"
                  data-bs-toggle="dropdown"
                  href="#"
                >
                  <span className="d-none d-lg-inline me-2 text-gray-600 small">
                    {authUser.first_name} {authUser.last_name}
                  </span>
                  <img
                    className="border rounded-circle img-profile"
                    src={
                      profilePictureFile
                        ? profilePictureFile.file
                        : "/assets/img/avatars/default-user-profile-picture.png"
                    }
                  />
                </a>
                <div
                  className="dropdown-menu shadow dropdown-menu-end animated--grow-in"
                  data-bs-popper="none"
                  style={{ borderStyle: "none", background: "white" }}
                >
                  <Link
                    className="dropdown-item"
                    to={
                      authUser.account_type === "landlord"
                        ? "/dashboard/landlord/my-account"
                        : "/dashboard/tenant/my-account"
                    }
                    style={{ borderStyle: "none" }}
                  >
                    <i className="fas fa-user fa-sm fa-fw me-2 text-gray-400" />
                    &nbsp;My Account
                  </Link>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      handleLogout(e);
                    }}
                  >
                    <i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400" />
                    &nbsp;Logout
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Topbar;
