import { screen, render, fireEvent } from "@testing-library/react";
import Headline from "./Headline";
import { MemoryRouter } from "react-router-dom";

const mockHistoryGoBack = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

describe("Test Headline", () => {
  test("Test Headline prop title", () => {
    render(<Headline title="标题" />);
    expect(screen.getByText("标题")).toBeInTheDocument();
  });

  test("Headline prop extra", () => {
    render(<Headline extra={<div>test</div>} />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  test("Headline prop isDetail", () => {
    render(<Headline isDetail />);

    expect(screen.getByText("返回")).toBeInTheDocument();
  });

  test("Headline prop className", () => {
    render(<Headline className="test-class" />);

    const dom = document.querySelector(".extra-design__head-line");

    expect(dom).toHaveClass("test-class");
  });

  test("Headline prop style", () => {
    render(<Headline style={{ color: "red" }} />);

    const dom = document.querySelector(".extra-design__head-line");

    expect(dom).toHaveStyle({ color: "red" });
  });

  test("Headline prop onBack", () => {
    const exec = jest.fn();

    render(<Headline onBack={exec} isDetail />);

    const dom = document.querySelector(
      ".extra-design__head-line--title--back"
    ) as Element;

    expect(dom).toBeInTheDocument();

    fireEvent.click(dom);

    expect(exec).toHaveBeenCalledTimes(1);
  });

  test("Headline prop default onBack", () => {
    render(
      <MemoryRouter>
        <Headline isDetail />
      </MemoryRouter>
    );

    const dom = document.querySelector(
      ".extra-design__head-line--title--back"
    ) as Element;

    expect(dom).toBeInTheDocument();

    fireEvent.click(dom);

    expect(mockHistoryGoBack).toHaveBeenCalledTimes(1);
  });
});
