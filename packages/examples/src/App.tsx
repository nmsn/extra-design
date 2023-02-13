import "./App.css";
import { Button, Divider } from "antd";
import {
  Headline,
  SearchGroup,
  PromptModal,
  FirstBtnPrimary,
} from "@extra-design/components";

import VirtualList from "./components/VirtualList";

function App() {
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
    </div>
  );
}

export default App;
