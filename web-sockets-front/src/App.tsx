import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import WebSocketConnector from "./WebSocketConnector";
import Welcome from "./Welcome";
import Conversation from "./Conversation";
import Sidebar from "./Sidebar";

export type Client = {
  connectionId: string;
  nickname: string;
};

export type Message = {
  messageId: string;
  nicknameToNickname: string;
  message: string;
  sender: string;
  createdAt: number;
};

const webSocketConnector = new WebSocketConnector();

function App() {
  const [nickname, setNickname] = useState(
    window.localStorage.getItem("nickname") || ""
  );

  const [clients, setClients] = useState<Client[]>([]);
  const [targetNicknameValue, setTargetNicknameValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    window.localStorage.setItem("nickname", nickname);
  });

  const webSocketConnectorRef = useRef(webSocketConnector);

  if (nickname === "") {
    return <Welcome setNickname={setNickname} />;
  }

  const url = `wss://eex5p2uf7d.execute-api.us-east-1.amazonaws.com/dev?nickname=${nickname}`;

  const ws = webSocketConnectorRef.current.getConnection(url);

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        action: "getClients",
      })
    );
  };

  ws.onmessage = (e) => {
    const message = JSON.parse(e.data) as {
      type: string;
      value: unknown;
    };

    console.log(message);

    if (message.type === "clients") {
      setClients((message.value as { clients: Client[] }).clients);
      console.log((message.value as { clients: Client[] }).clients);
    }

    if (message.type === "messages") {
      setMessages((message.value as { messages: Message[] }).messages);
    }
  };

  const setTargetNickname = (nickname: string) => {
    setTargetNicknameValue(nickname);
    ws.send(
      JSON.stringify({
        action: "getMessages",
        targetNicknameValue: nickname,
        limit: 1000,
      })
    );
    setTargetNicknameValue(nickname);
  };

  return (
    <div className="flex">
      <div className="flex-none w-16 md:w-40 border-r-2">
        <Sidebar clients={clients} setTargetNickname={setTargetNickname} />;
      </div>
      <div className="felx-auto">
        <Conversation messages={messages}/>;
      </div>
    </div>
  );
}

export default App;
