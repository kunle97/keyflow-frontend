import React, { useRef,useState } from "react";
import styles from "./styles/scrollbarStyles.module.css";
import { uiGreen, uiGrey1 } from "../../../constants";
const ConversationView = (props) => {
  const [selectedThread, setSelectedThread] = useState(null);
  const scrollableDivRef = useRef(null); // This is the reference to the div hodling the select threads conversations
  return (<></>
    // <div>
    //   {true ? (
    //     <>
    //       <div
    //         className={`card ${styles.customScrollbar}`}
    //         style={{
    //           height: "650px",
    //           overflowY: "auto",
    //           padding: "10px 0",
    //         }}
    //         ref={scrollableDivRef}
    //       >
    //         <ul className="p-0 m-0" style={{ verticalAlign: "bottom" }}>
    //           {selectedThread.messages
    //             .slice()
    //             .reverse()
    //             .map((message) => (
    //               <li
    //                 key={message.id}
    //                 style={{ width: "100%", overflow: "auto" }}
    //                 className="list-group-item"
    //               >
    //                 <span
    //                   style={{
    //                     backgroundColor: message.isSender ? uiGreen : uiGrey1,
    //                     color: "white",
    //                     border: "none",
    //                     float: message.isSender ? "right" : "left",
    //                     padding: "5px 10px",
    //                     borderRadius: "10px",
    //                     margin: "5px 10px",
    //                     maxWidth: "80%",
    //                   }}
    //                   className="text-white"
    //                 >
    //                   {message.text}
    //                 </span>
    //               </li>
    //             ))}
    //         </ul>
    //       </div>
    //<form onSubmit={handleSendMessage} className="mt-3">
    //         <div className="input-group">
    //           <input
    //             type="text"
    //             className="card"
    //             placeholder="Type your message here..."
    //             value={message}
    //             onChange={(e) => setMessage(e.target.value)}
    //             style={{
    //               backgroundColor: `${uiGrey2} !important`,
    //               color: "white",
    //               border: "none",
    //               position: "relative",
    //               flex: "1 1 auto",
    //               width: "1%",
    //               marginRight: "10px",
    //               borderRadius: "5px",
    //               padding: "10px",
    //               outline: "none",
    //             }}
    //             required
    //           />
    //           <div className="">
    //             <UIButton
    //               style={{
    //                 padding: "10px",
    //               }}
    //               btnText={
    //                 <>
    //                   <i className="fas fa-paper-plane" />
    //                   <span> Send</span>
    //                 </>
    //               }
    //               type="submit"
    //             />
    //           </div>
    //         </div>
    //       </form>
    //     </>
    //   ) : (
    //     <UIPrompt
    //       icon={<MessageOutlinedIcon sx={{ color: uiGreen }} />}
    //       title="Select a thread"
    //       message="Select a thread to view your conversation or start a new one by clicking on the New Message button."
    //     />
    //   )}
    // </div>
  );
};

export default ConversationView;
