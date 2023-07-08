import { NodeContainer } from "./SearchItem";
import { render } from "@testing-library/react";

describe("Test NodeContainer", () => {
  test("Test NodeContainer prop", () => {
    const { getByText } = render(
      <NodeContainer itemKey="itemKey" label="label">
        children
      </NodeContainer>
    );

    expect(getByText("label:")).toBeInTheDocument();
    expect(getByText("children")).toBeInTheDocument();
  });
});
