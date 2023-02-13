import { message as antdMsg } from "antd";

type TypeEnum = "warn" | "success" | "error";

type MessageType = { type: TypeEnum; message: string };

let messageList: MessageType[] = [];

const durationTime = 3000;

const exec = (message: string, type: TypeEnum) => {
  if (messageList.some((item) => item.message === message)) {
    return;
  }

  messageList.push({ message, type });
  antdMsg[type](message);

  setTimeout(() => {
    messageList = messageList.filter((item) => item.message !== message);
  }, durationTime);
};

const globalMessage = {
  success: (message: string) => exec(message, "success"),
  warn: (message: string) => exec(message, "warn"),
  error: (message: string) => exec(message, "error"),
};

export default globalMessage;
