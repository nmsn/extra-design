import "./App.css";
import { useState } from "react";
import { Button, Divider, Modal } from "antd";
import {
  Headline,
  SearchGroup,
  FirstBtnPrimary,
  globalMessage,
  PromptModal,
  WarningAlert,
} from "@extra-design/components";

import VirtualList from "./components/VirtualList";

function App() {
  const [visible, setVisible] = useState(false);

  const onToggle = () => {
    setVisible(!visible);
  };
  return (
    <div className="App">
      <Button type="primary">测试</Button>
      <Divider />
      <Headline title="head">123</Headline>
      <Divider />
      <VirtualList />
      <Divider />
      <SearchGroup
        searchNode={[
          {
            label: "任务名称",
            key: "taskName",
            type: "input",
            placeholder: "请输入",
          },
          {
            label: "任务编号",
            key: "taskNo",
            type: "input",
            placeholder: "请输入",
          },
          {
            label: "任务编号",
            key: "taskNo",
            type: "input",
            placeholder: "请输入",
          },
          {
            label: "任务编号",
            key: "taskNo",
            type: "input",
            placeholder: "请输入",
            hidden: true,
          },
        ]}
        onSearch={(...data: any[]) => console.log(data)}
      />
      <Divider />
      <Button
        onClick={() =>
          PromptModal.openPromptModal({
            type: "prompt",
            title: "123",
          })
        }
      >
        确认
      </Button>
      <Divider />
      <FirstBtnPrimary>
        <Button>1</Button>
        <Button>2</Button>
        <Button>3</Button>
        <Button>4</Button>
        <Button>5</Button>
      </FirstBtnPrimary>
      <Divider />
      <Button onClick={() => globalMessage.success("123")}>
        globalMessage
      </Button>
      <Divider />
      <Modal
        open={visible}
        title="Basic Modal"
        onOk={onToggle}
        onCancel={onToggle}
      >
        <WarningAlert>123</WarningAlert>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <Button onClick={onToggle}>WaringAlert</Button>
    </div>
  );
}

export default App;
