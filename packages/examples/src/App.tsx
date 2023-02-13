import "./App.css";
import { Button } from "antd";
import { Headline, SearchGroup, PromptModal } from "@extra-design/components";

import VirtualList from "./components/VirtualList";

function App() {
  return (
    <div className="App">
      <Button type="primary">测试</Button>
      <Headline title="head">123</Headline>
      <VirtualList />
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

      <button
        onClick={() =>
          PromptModal.openPromptModal({
            type: "prompt",
            title: "123",
          })
        }
      >
        确认
      </button>
    </div>
  );
}

export default App;
