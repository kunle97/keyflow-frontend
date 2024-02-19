import React, { useState } from "react";
import UIDialog from "../../Modals/UIDialog";
import { ButtonBase, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { uiGreen } from "../../../../../constants";
import UIButton from "../../UIButton";
import UIRadioGroup from "../../UIRadioGroup";
import ProgressModal from "../../Modals/ProgressModal";
import AlertModal from "../../Modals/AlertModal";
const ContactVendorModal = (props) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      message:
        "Hello, I have recently been informed by my tenant that there is a leak in the bathroom. I would like to have this issue resolved as soon as possible. Best Regards, John Doe",
    },
    {
      id: 2,
      message:
        "To whom it may concern, I am writing to inform you that there is a leak in the bathroom. I would like to have this issue resolved as soon as possible.",
    },
    {
      id: 3,
      message:
        "Hello, my tenant has informed me that there is a leak in the bathroom. I would like to have this issue resolved as soon as possible. How soon can you have someone come out to fix this issue?",
    },
    {
      id: 4,
      message:
        "To whom it may concern, I am writing to inform you that there is a leak in the bathroom. I would like to have this issue resolved as soon as possible. Best Regards, John Doe",
    },
    {
      id: 5,
      message:
        "Hello, my tenant has informed me that there is a leak in the bathroom. I would like to have this issue resolved as soon as possible. Best Regards, John Doe",
    },
  ]);
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [attachMessage, setAttachMessage] = useState("yes");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleSubmit = () => {
    //Show the loading progress modal for 3 seconds and then show the alert modal
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAlert(true);
    }, 3000);
    props.onClose();
  };
  const generateMessage = () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setSelectedMessage(randomMessage);
  };
  return (
    <div>
      <ProgressModal title="Sending Message" open={isLoading} />
      <AlertModal
        open={showAlert}
        title="Message Sent"
        message="Your message has been sent to the vendor successfully"
        btnText="Close"
        onClick={() => setShowAlert(false)}
      />
      <UIDialog
        title={"Contact Vendor"}
        onClose={props.onClose}
        open={props.open}
      >
        <p className="text-black">
          This maintenance request has not yet been assigned to a vendor. You
          can contact the vendor by sending a message below.
        </p>

        <h6 className="text-black">Tenat Message</h6>
        <p className="text-black">{props.issue}</p>

        <form>
          <div className="form-group mb-3">
            <h6 htmlFor="message" className="text-black">
              Message
            </h6>
            <textarea
              className="form-control"
              id="message"
              rows="3"
              placeholder="Enter your message here"
              value={selectedMessage.message}
            ></textarea>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
              sx={{ marginTop: "5px" }}
            >
              <ButtonBase
                sx={{
                  color: uiGreen,
                }}
                onClick={generateMessage}
              >
                Generate Message <RefreshIcon sx={{ fontSize: "10pt" }} />
              </ButtonBase>
            </Stack>
          </div>
          <div className="form-group mb-3">
            <h6 htmlFor="attachment" className="text-black">
              Attachment
            </h6>
            <input
              type="file"
              className="form-control"
              id="attachment"
              placeholder="Upload an attachment"
            />
          </div>
          <div className="form-group mb-3">
            <h6 htmlFor="notes" className="text-black">
              Send tenant message to vendor?
            </h6>
            <UIRadioGroup
              name="attach_message"
              value={attachMessage}
              radioOptions={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
              onChange={(e) => {
                setAttachMessage(e.target.value);
              }}
            />
          </div>
          <UIButton
            type="button"
            style={{ width: "100%" }}
            btnText="Send Message"
            onClick={handleSubmit}
          />
        </form>
      </UIDialog>
    </div>
  );
};

export default ContactVendorModal;
