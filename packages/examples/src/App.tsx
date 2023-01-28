import "./App.css";
import { Button } from "antd";
import { Headline } from "@extra-design/components";

import VirtualList from "./components/VirtualList";

function App() {
  return (
    <div className="App">
      <Button type="primary">测试</Button>
      <Headline title="head">123</Headline>
      <VirtualList />
    </div>
  );
}

export default App;
