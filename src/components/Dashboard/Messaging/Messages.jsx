import { faker } from "@faker-js/faker";
import { Stack } from "@mui/material";
import React, { useState } from "react";
import {
  dateDiffForHumans,
  uiGreen,
  uiGrey1,
  uiGrey2,
  uiRed,
} from "../../../constants";
import UIPrompt from "../UIComponents/UIPrompt";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import UIButton from "../UIComponents/UIButton";
import NewMessageDialog from "./NewMessageDialog";
const Messages = () => {
  const [selectedThread, setSelectedThread] = useState(null);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const threadSelectedStyle = {
    backgroundColor: uiGreen,
    color: "white",
    border: "none",
  };
  const threads = [
    {
      id: 1,
      name: "John Doe",
      messages: [
        {
          id: 1,
          text: "Hey, how are you?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 2,
          text: "I'm good, thanks for asking. How about you?",
          timestamp: "2021-10-01",
          isSender: false,
        },
        {
          id: 3,
          text: "I'm doing well too. What have you been up to?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 1,
          text: "Hey, how are you?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 2,
          text: "I'm good, thanks for asking. How about you?",
          timestamp: "2021-10-01",
          isSender: false,
        },
        {
          id: 3,
          text: "I'm doing well too. What have you been up to?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 1,
          text: "Hey, how are you?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 2,
          text: "I'm good, thanks for asking. How about you?",
          timestamp: "2021-10-01",
          isSender: false,
        },
        {
          id: 3,
          text: "I'm doing well too. What have you been up to?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 1,
          text: "Hey, how are you?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 2,
          text: "I'm good, thanks for asking. How about you?",
          timestamp: "2021-10-01",
          isSender: false,
        },
        {
          id: 3,
          text: "I'm doing well too. What have you been up to?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 1,
          text: "Hey, how are you?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 2,
          text: "I'm good, thanks for asking. How about you?",
          timestamp: "2021-10-01",
          isSender: false,
        },
        {
          id: 3,
          text: "I'm doing well too. What have you been up to?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 1,
          text: "Hey, how are you?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 2,
          text: "I'm good, thanks for asking. How about you?",
          timestamp: "2021-10-01",
          isSender: false,
        },
        {
          id: 3,
          text: "I'm doing well too. What have you been up to?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 1,
          text: "Hey, how are you?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 2,
          text: "I'm good, thanks for asking. How about you?",
          timestamp: "2021-10-01",
          isSender: false,
        },
        {
          id: 3,
          text: "I'm doing well too. What have you been up to?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 1,
          text: "Hey, how are you?",
          timestamp: "2021-10-01",
          isSender: true,
        },
        {
          id: 2,
          text: "I'm good, thanks for asking. How about you?",
          timestamp: "2021-10-01",
          isSender: false,
        },
        {
          id: 3,
          text: "I'm doing well too. What have you been up to?",
          timestamp: "2021-10-01",
          isSender: true,
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      messages: [
        { id: 1, text: "Hi there!", timestamp: "2021-10-01", isSender: true },
        {
          id: 2,
          text: "Hey Jane, what's up?",
          timestamp: "2021-10-01",
          isSender: false,
        },
        {
          id: 3,
          text: "Not much, just wanted to check in and see how you're doing.",
          timestamp: "2021-10-01",
          isSender: true,
        },
      ],
    },
  ];

  const handleThreadClick = (thread) => {
    setSelectedThread(thread);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <>
      <NewMessageDialog
        open={showNewMessageDialog}
        handleClose={() => setShowNewMessageDialog(false)}
      />
      <div>
        <div className="row">
          <div className="col-md-4">
            <UIButton
              btnText="New Message"
              style={{ width: "100%", marginBottom: "15px" }}
              onClick={() => setShowNewMessageDialog(true)}
            />
            <ul className="card list-group">
              {threads.map((thread) => (
                <li
                  key={thread.id}
                  className={`list-group-item`}
                  style={
                    selectedThread?.id === thread.id
                      ? threadSelectedStyle
                      : {
                          backgroundColor: uiGrey2,
                          color: "white",
                          border: "none",
                        }
                  }
                  onClick={() => handleThreadClick(thread)}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <img
                      className="rounded-circle "
                      width={50}
                      src={
                        process.env.REACT_APP_ENVIRONMENT !== "development"
                          ? ""
                          : faker.image.avatar()
                      }
                    />
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
                        <span style={{ fontSize: "16pt" }}>{thread.name}</span>{" "}
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
                        <span className="text-white">
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
              ))}
            </ul>
          </div>
          <div className="col-md-8">
            <div className="">
              {selectedThread ? (
                <>
                  <div
                    className="card"
                    style={{
                      height: "650px",
                      overflowY: "auto",
                      padding: "10px 0",
                    }}
                  >
                    <ul className="p-0 m-0" style={{ verticalAlign: "bottom" }}>
                      {selectedThread.messages.map((message) => (
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
                            }}
                            className="text-white"
                          >
                            {message.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <form onSubmit={sendMessage} className="mt-3">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type your message here..."
                        style={{
                          backgroundColor: uiGrey1,
                          color: "white",
                          border: "none",
                        }}
                      />
                      <div className="">
                        <UIButton
                          btnText={
                            <>
                              <i className="fas fa-paper-plane" />
                              <span> Send</span>
                            </>
                          }
                          type="submit"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <UIPrompt
                  icon={<MessageOutlinedIcon sx={{ color: uiGreen }} />}
                  title="Select a thread"
                  message="Select a thread to view messages"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
