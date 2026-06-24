import { render, screen } from "@testing-library/react";
import Loading from "./Loading";

describe("Loading Component", () => {
  it("renders default loading message", () => {
    render(<Loading />);

    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument();
  });

  it("renders custom loading message", () => {
    render(
      <Loading message="Fetching data..." />
    );

    expect(
      screen.getByText("Fetching data...")
    ).toBeInTheDocument();
  });

  it("does not render message when empty string is passed", () => {
    render(<Loading message="" />);

    expect(
      screen.queryByText("Loading...")
    ).not.toBeInTheDocument();
  });

  it("renders fullscreen class when fullScreen=true", () => {
    const { container } = render(
      <Loading fullScreen />
    );

    const wrapper =
      container.querySelector(".loading");

    expect(wrapper).toHaveClass(
      "loading--fullscreen"
    );
  });

  it("renders normal loading class by default", () => {
    const { container } = render(<Loading />);

    const wrapper =
      container.querySelector(".loading");

    expect(wrapper).not.toHaveClass(
      "loading--fullscreen"
    );
  });

  it("renders harmonium loader", () => {
    const { container } = render(<Loading />);

    const loader =
      container.querySelector(
        ".loading__harmonium"
      );

    expect(loader).toBeInTheDocument();
  });

  it("renders exactly 5 harmonium bars", () => {
    const { container } = render(<Loading />);

    const bars =
      container.querySelectorAll(
        ".loading__harmonium span"
      );

    expect(bars).toHaveLength(5);
  });
});