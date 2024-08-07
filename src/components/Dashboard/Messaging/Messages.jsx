import React, { useState, useRef, useEffect } from "react";
import { ButtonBase, IconButton, Stack } from "@mui/material";
import {
  authUser,
  dateDiffForHumans,
  uiGreen,
  uiGrey1,
  uiGrey2,
  uiRed,
} from "../../../constants";
import TryIcon from "@mui/icons-material/Try";
import UIPrompt from "../UIComponents/UIPrompt";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import UIButton from "../UIComponents/UIButton";
import NewMessageDialog from "./NewMessageDialog";
import {
  sendMessage,
  setMessageThreadAsRead,
  listThreadMessages,
  listThreads,
} from "../../../api/messages";
import AlertModal from "../UIComponents/Modals/AlertModal";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import styles from "./styles/scrollbarStyles.module.css";
import { useParams } from "react-router";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import useScreen from "../../../hooks/useScreen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Messages = () => {
  const { thread_id } = useParams();
  const { isMobile } = useScreen();
  const [currentName, setCurrentName] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [messageThreads, setMessageThreads] = useState(null);
  const [filteredThreads, setFilteredThreads] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const scrollableDivRef = useRef(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const searchBarRef = useRef(null);
  const [showConversationCard, setShowConversationCard] = useState(false);

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemovePreview = () => {
    setPreview(null);
  };

  const threadSelectedStyle = {
    backgroundColor: uiGreen,
    color: "white",
    border: "none",
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    setLoadingMessage("Fetching messages...");
    try {
      const res = await listThreads();
      setMessageThreads(res.data);
      setFilteredThreads(res.data);
    } catch (err) {
      console.error(err);
      setAlertTitle("Error");
      setAlertMessage(
        "An error occurred while fetching your messages. Please try again."
      );
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThreadClick = async (thread) => {
    console.log(thread);
    setSelectedThread(thread);
    if (isMobile) {
      setShowConversationCard(true);
    }
    setCurrentName(thread.name);
    try {
      await setMessageThreadAsRead({ other_user_id: thread.recipient_id });
      const res = await listThreadMessages(thread.id);
      setSelectedThread((prevThread) => ({
        ...prevThread,
        messages: res.data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    setIsLoading(true);
    setLoadingMessage("Sending message...");
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get("file");
    const message = formData.get("body");
    const payload = {
      file: file,
      body: message,
      sender: authUser.id,
      recipient: selectedThread.recipient_id,
      subfolder: "messages",
    };
    try {
      const res = await sendMessage(payload);
      if (res.status === 200) {
        const updatedThread = {
          ...selectedThread,
          messages: [
            ...selectedThread.messages,
            {
              id: selectedThread.messages.length + 1,
              text: message,
              timestamp: new Date().toISOString(),
              isSender: true,
              file: file?.name ? { file: URL.createObjectURL(file) } : null,
            },
          ],
        };
        const updatedThreads = messageThreads.map((thread) =>
          thread.id === selectedThread.id ? updatedThread : thread
        );
        setMessageThreads(updatedThreads);
        setSelectedThread(updatedThread);
        setMessage("");
        fetchMessages();
        e.target.reset();
        handleRemovePreview();
      } else {
        setAlertTitle("Error");
        setAlertMessage(
          "An error occurred while sending your message. Please try again."
        );
        setShowAlert(true);
      }
    } catch (err) {
      console.error(err);
      setAlertTitle("Error");
      setAlertMessage(
        "An error occurred while sending your message. Please try again."
      );
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchThread = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredThreads = messageThreads.filter((thread) =>
      thread.name.toLowerCase().includes(query)
    );
    setFilteredThreads(filteredThreads);
    if (query === "") {
      setFilteredThreads(messageThreads);
    }
  };

  useEffect(() => {
    if (selectedThread && scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop =
        scrollableDivRef.current.scrollHeight;
    }
  }, [selectedThread]);

  useEffect(() => {
    try {
      if (!messageThreads) {
        fetchMessages();
      }
      if (messageThreads && thread_id && authUser.account_type === "owner") {
        searchBarRef.current.value = thread_id;
        setSearchQuery(thread_id);
        const filteredThreads = messageThreads.filter(
          (thread) => thread.name === thread_id
        );
        setFilteredThreads(filteredThreads);
        setSelectedThread(filteredThreads[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }, [messageThreads]);

  return (
    <>
      <div className="container-fluid pt-3">
        <ProgressModal open={isLoading} title={loadingMessage} />
        <AlertModal
          open={showAlert}
          onClick={() => setShowAlert(false)}
          title={alertTitle}
          message={alertMessage}
          btnText="Okay"
        />
        <div>
          <div className="row">
            {(!isMobile || !showConversationCard) && (
              <div className="col-md-4">
                <>
                  <NewMessageDialog
                    open={showNewMessageDialog}
                    handleClose={() => setShowNewMessageDialog(false)}
                  />{" "}
                  <UIButton
                    btnText="New Message"
                    style={{ width: "100%", marginBottom: "15px" }}
                    onClick={() => setShowNewMessageDialog(true)}
                  />{" "}
                  <input
                    type="text"
                    ref={searchBarRef}
                    className="card"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchThread}
                    style={{
                      color: "black",
                      border: "none",
                      width: "100%",
                      borderRadius: "5px",
                      padding: "10px",
                      outline: "none",
                      marginBottom: "15px",
                    }}
                    required
                  />
                </>
                {messageThreads && messageThreads.length > 0 && (
                  <ul
                    className={`card list-group ${styles.customScrollbar}`}
                    style={{
                      maxHeight: "600px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {filteredThreads.map((thread) => {
                      return (
                        <li
                          key={thread.id}
                          className={`list-group-item`}
                          style={
                            selectedThread?.id === thread.id
                              ? threadSelectedStyle
                              : {
                                  color: uiGrey2,
                                  backgroundColor: "white",
                                  border: "none",
                                }
                          }
                          onClick={() => handleThreadClick(thread)}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            {/* <div
                            style={{
                              borderRadius: "50%",
                              overflow: "hidden",
                              width: "65px",
                              height: "50px",
                            }}
                          >
                            <img
                              style={{
                                height: "120%",
                                margin: "-5px auto 0 -1.5px",
                              }}
                              src={
                                thread.user_data.uploaded_profile_picture
                                  ? thread.user_data.uploaded_profile_picture
                                      .file
                                  : defaultUserProfilePicture
                              }
                            />
                          </div> */}
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
                                <span
                                  style={{
                                    fontSize: "15pt",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    maxWidth: "150px", // Adjust the width to accommodate the other span's width
                                  }}
                                >
                                  {thread.name}
                                </span>{" "}
                                <span className="text-black">
                                  {dateDiffForHumans(
                                    new Date(thread.latest_message_timestamp)
                                  )}
                                </span>
                              </Stack>
                              <Stack
                                sx={{ width: "100%", marginTop: "0px" }}
                                direction="row"
                                alignItems="center"
                                spacing={0}
                                justifyContent="space-between"
                              >
                                {/* Thread Most Recent Message Preview: */}
                                <span
                                  className="text-muted"
                                  style={{
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    maxWidth: "220px", // Adjust the width to accommodate the other span's width
                                  }}
                                >
                                  {thread.latest_message}
                                </span>
                                <span
                                  style={{
                                    backgroundColor: uiRed,
                                    color: "white",
                                    borderRadius: "20%",
                                    padding: "0 5px",
                                  }}
                                >
                                  {/*Using the filter() function on messages.thread  to find the number of unread messages from the other person*/}
                                  {/* {thread.messages.filter(
                                      (message) =>
                                        message.isSender === false &&
                                        message.isRead === false
                                    ).length !== 0 &&
                                      thread.messages.filter(
                                        (message) =>
                                          message.isSender === false &&
                                          message.isRead === false
                                      ).length} */}
                                  {thread.unread_messages_count}
                                </span>
                              </Stack>
                            </Stack>
                          </Stack>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
            {(!isMobile || showConversationCard) && (
              <div className="col-md-8">
                {isMobile && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    style={{ marginBottom: "15px" }}
                  >
                    <IconButton onClick={() => setShowConversationCard(false)}>
                      <ArrowBackIcon sx={{ color: uiGreen }} />
                    </IconButton>
                    <h4>{selectedThread.name}</h4>
                  </Stack>
                )}

                <div>
                  {selectedThread ? (
                    <>
                      <div
                        className={`card ${styles.customScrollbar}`}
                        style={{
                          height: isMobile ? "60vh" : "650px",
                          overflowY: "auto",
                          padding: "10px 0",
                        }}
                        ref={scrollableDivRef}
                      >
                        <ul
                          className="p-0 m-0"
                          style={{ verticalAlign: "bottom" }}
                        >
                          {selectedThread.messages &&
                            selectedThread.messages.length > 0 &&
                            selectedThread.messages.map((message) => (
                              <li
                                key={message.id}
                                style={{ width: "100%", overflow: "auto" }}
                                className="list-group-item"
                              >
                                <span
                                  style={{
                                    backgroundColor: message.isSender
                                      ? uiGreen
                                      : uiGrey1,
                                    color: "white",
                                    border: "none",
                                    float: message.isSender ? "right" : "left",
                                    padding: "5px 10px",
                                    borderRadius: "10px",
                                    margin: "5px 10px",
                                    maxWidth: "80%",
                                  }}
                                  className="text-white"
                                >
                                  {message.text}
                                  {message.file && (
                                    <div>
                                      <img
                                        src={message.file.file}
                                        style={{ width: "100%" }}
                                      />
                                    </div>
                                  )}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <form onSubmit={handleSendMessage} className="mt-3">
                        <div className="input-group">
                          <input
                            type="text"
                            className="card"
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                              border: "none",
                              position: "relative",
                              flex: "1 1 auto",
                              width: "1%",
                              marginRight: "10px",
                              borderRadius: "5px",
                              padding: "10px",
                              outline: "none",
                            }}
                            required
                            name="body"
                          />
                          {/* <input type="file" name="file" /> */}
                          <>
                            {/* Paperclip icon */}
                            <label htmlFor="fileInput">
                              <AttachFileIcon
                                style={{
                                  height: "100%",
                                  marginRight: "15px",
                                  color: uiGreen,
                                }}
                              />
                            </label>
                            {/* Actual file input, visually hidden */}
                            <input
                              type="file"
                              id="fileInput"
                              name="file"
                              style={{ display: "none" }}
                              onChange={handleFileInputChange}
                            />
                          </>
                          <div className="input-group-append"></div>
                          <div className="">
                            <UIButton
                              style={{
                                padding: "10px",
                              }}
                              btnText={
                                <>
                                  <i className="fas fa-paper-plane mr-1" />
                                  <span> Send</span>
                                </>
                              }
                              type="submit"
                            />
                          </div>
                        </div>
                      </form>
                      {preview && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "20px",
                            position: "relative",
                            maxWidth: "120px",
                          }}
                        >
                          <img
                            src={preview}
                            alt="File Preview"
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              marginLeft: "10px",
                            }}
                          />
                          <CancelIcon
                            style={{
                              position: "absolute",
                              top: -10,
                              right: 0,
                              cursor: "pointer",
                              backgroundColor: "rgba(255, 255, 255, 0.5)",
                              borderRadius: "50%",
                              padding: "2px",
                            }}
                            onClick={handleRemovePreview}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <UIPrompt
                      icon={<MessageOutlinedIcon sx={{ color: uiGreen }} />}
                      title="Select a thread"
                      message="Select a thread to view your conversation or start a new one by clicking on the New Message button."
                      style={{ height: "705px" }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
