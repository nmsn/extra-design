import { NodeContainer, InputItem } from "./SearchItem";
import { render, fireEvent } from "@testing-library/react";
import { Enter } from "@/_utils/keycode";
import { useState } from "react";

describe("Test NodeContainer", () => {
  test("Test NodeContainer prop", () => {
    const { getByText } = render(
      <NodeContainer label="label">children</NodeContainer>
    );

    expect(getByText("label:")).toBeInTheDocument();
    expect(getByText("children")).toBeInTheDocument();
  });
});

const InputTextContainer = ({
  onSearch,
  onChange,
}: {
  onSearch: React.ComponentProps<typeof InputItem>["onSearch"];
  onChange: React.ComponentProps<typeof InputItem>["onChange"];
}) => {
  const [val, setVal] = useState<Record<string, string>>({
    testName: "",
  });

  const onCurChange = (v: Record<string, string>) => {
    setVal(v);
    onChange?.(v);
  };

  const onCurSearch = (v: Record<string, string>) => {
    setVal(v);
    onSearch?.(v);
  };

  return (
    <InputItem
      name="testName"
      placeholder="testPlaceholder"
      value={val.testName}
      onSearch={onCurSearch}
      onChange={onCurChange}
    />
  );
};

describe("Test InputItem", () => {
  test("Test InputItem prop state", () => {
    const { getByDisplayValue, getByPlaceholderText } = render(
      <InputItem
        name="testName"
        placeholder="testPlaceholder"
        value="testValue"
      />
    );

    expect(getByPlaceholderText("testPlaceholder")).toBeInTheDocument();
    expect(getByDisplayValue("testValue")).toBeInTheDocument();
  });

  test("Test InputItem prop state", () => {
    const onSearch = jest.fn((data) => data);
    const onChange = jest.fn((data) => data);

    const { getByDisplayValue, getByPlaceholderText } = render(
      <InputTextContainer onSearch={onSearch} onChange={onChange} />
    );

    expect(getByPlaceholderText("testPlaceholder")).toBeInTheDocument();
    const input = getByPlaceholderText("testPlaceholder") as HTMLInputElement;
    input && fireEvent.change(input, { target: { value: "testVal" } });
    expect(onChange.mock.calls.length).toBe(1);
    expect(onSearch.mock.calls.length).toBe(0);
    expect(onChange.mock.results[0].value).toEqual({ testName: "testVal" });

    expect(getByDisplayValue("testVal")).toBeInTheDocument();

    fireEvent.keyDown(input, { keyCode: Enter.code });

    expect(onChange.mock.calls.length).toBe(1);
    expect(onSearch.mock.calls.length).toBe(1);
    expect(onSearch.mock.results[0].value).toEqual({ testName: "testVal" });
  });
});
