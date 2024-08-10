import React from "react";
import chatbot from "../assets/chatbot.png";
import { Link } from "react-router-dom";

const Chatbot = () => {
  return (
    <div>
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/skvxT41WhTZr3YQMULUdr"
        width="100%"
        style="height: 100%; min-height: 700px"
        frameborder="0"
      ></iframe>
    </div>
  );
};

export default Chatbot;
