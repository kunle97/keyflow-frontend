import { Stack } from "@mui/material";
import React, { useState, useRef } from "react";
import {
  authUser,
  dateDiffForHumans,
  defaultUserProfilePicture,
  uiGreen,
  uiGrey1,
  uiGrey2,
  uiRed,
} from "../../../constants";
import UIPrompt from "../UIComponents/UIPrompt";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import UIButton from "../UIComponents/UIButton";
import NewMessageDialog from "./NewMessageDialog";
import { useEffect } from "react";
import { retrieveUserThreads, sendMessage } from "../../../api/messages";
import AlertModal from "../UIComponents/Modals/AlertModal";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import styles from "./styles/scrollbarStyles.module.css"; // Path to your CSS module file
import { useParams } from "react-router";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
const Messages = () => {
  const [selectedThread, setSelectedThread] = useState(null);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [messageThreads, setMessageThreads] = useState(null);
  const [filteredThreads, setFilteredThreads] = useState(null); // This is the filtered threads array [searched threads
  const [searchQuery, setSearchQuery] = useState(""); // This is the search query for the messages
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState(""); // This is the title of the alert modal
  const [message, setMessage] = useState(""); // This is the message to be sent
  const [isLoading, setIsLoading] = useState(false); // This is the loading state for the messages [threads]
  const scrollableDivRef = useRef(null); // This is the reference to the div hodling the select threads conversations
  const [loadingMessage, setLoadingMessage] = useState(""); // This is the loading message for the progress modal
  const searchBarRef = useRef(null);

  const [preview, setPreview] = useState(null);

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
  const { thread_id } = useParams();

  const fetchMessages = () => {
    setIsLoading(true);
    setLoadingMessage("Fetching messages...");
    retrieveUserThreads()
      .then((res) => {
        console.log("New Threads", res);
        setMessageThreads(res.data);
        setFilteredThreads(res.data);
      })
      .catch((err) => {
        console.log(err);
        setAlertTitle("Error");
        setAlertMessage(
          "An error occurred while fetching your messages. Please try again."
        );
        setShowAlert(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleThreadClick = (thread) => {
    setSelectedThread(thread);

    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop =
        scrollableDivRef.current.scrollHeight;
    }
  };

  const handleSendMessage = (e) => {
    setIsLoading(true);
    setLoadingMessage("Sending message...");
    e.preventDefault();
    //Use form data object to retrieve the message and file from the input field
    const formData = new FormData(e.target);
    const file = formData.get("file");
    const message = formData.get("body");
    //Create a new message object
    let payload = {
      file: file,
      body: message,
      user: authUser.user_id,
      recipient: selectedThread.recipient_id,
      subfolder: "messages",
    };
    console.log(payload);
    sendMessage(payload)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          //Update the selected thread with the new message
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
          //Create a new array of threads with the updated thread
          const updatedThreads = messageThreads.map((thread) =>
            thread.id === selectedThread.id ? updatedThread : thread
          );
          //Update the state with the new threads array
          setMessageThreads(updatedThreads);
          //Update the selected thread
          setSelectedThread(updatedThread);
          //Clear the message input field
          setMessage("");
          fetchMessages();
          e.target.reset();
          handleRemovePreview();
        } else {
          //Show an error message
          setAlertTitle("Error");
          setAlertMessage(
            "An error occurred while sending your message. Please try again."
          );
          setShowAlert(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setAlertTitle("Error");
        setAlertMessage(
          "An error occurred while sending your message. Please try again."
        );
        setShowAlert(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //Create a function handleSearchThread to filter the message threads by the thread name and user the search query state to filter the threads
  const handleSearchThread = (e) => {
    const query = e.target.value.toLowerCase();

    // Update searchQuery state using the functional form of setState
    setSearchQuery(query);

    // Filter the threads using the updated searchQuery state
    const filteredThreads = messageThreads.filter((thread) =>
      thread.name.toLowerCase().includes(query)
    );

    // Update the filtered threads state
    setFilteredThreads(filteredThreads);

    // Reset threads if the search query is empty
    if (query === "") {
      setFilteredThreads(messageThreads);
    }
  };

  useEffect(() => {
    try {
      if (!messageThreads) {
        fetchMessages();
      }
      if (messageThreads && thread_id && authUser.account_type === "landlord") {
        //Set the search bar ref value to the thread_id
        searchBarRef.current.value = thread_id;
        setSearchQuery(thread_id);
        // Filter the threads using the updated searchQuery state
        const filteredThreads = messageThreads.filter(
          (thread) => thread.name == thread_id
        );
        // Update the filtered threads state
        setFilteredThreads(filteredThreads);
        setSelectedThread(filteredThreads[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [messageThreads]); // Be cautious with this dependency

  return (
    <div className="container-fluid">
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
          <div className="col-md-4">
            {authUser.account_type === "landlord" && (
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
                    backgroundColor: `${uiGrey2} !important`,
                    color: "white",
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
            )}
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
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <div
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
                                ? thread.user_data.uploaded_profile_picture.file
                                : defaultUserProfilePicture
                            }
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
                            <span className="text-black">
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
                              className="tblack"
                              style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                maxWidth: "220px", // Adjust the width to accommodate the other span's width
                              }}
                            >
                              {thread.messages[thread.messages.length - 1].text}
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
          </div>
          <div className="col-md-8">
            <div>
              {selectedThread ? (
                <>
                  <div
                    className={`card ${styles.customScrollbar}`}
                    style={{
                      height: "650px",
                      overflowY: "auto",
                      padding: "10px 0",
                    }}
                    ref={scrollableDivRef}
                  >
                    <ul className="p-0 m-0" style={{ verticalAlign: "bottom" }}>
                      {selectedThread.messages
                        // .slice()
                        // .reverse()
                        .map((message) => (
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
                      <input
                        type="text"
                        className="card"
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{
                          backgroundColor: `${uiGrey2} !important`,
                          color: "white",
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
                      <div className="">
                        <UIButton
                          style={{
                            padding: "10px",
                          }}
                          btnText={
                            <>
                              <i className="fas fa-paper-plane" />
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
        </div>
      </div>
    </div>
  );
};

export default Messages;
