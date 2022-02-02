import { render, screen } from "@testing-library/react";

import { ActiveLink } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

describe("ActiveLink component", () => {
  it("renders correctly", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  it("adds active active class if the link is currently active", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText(/home/i)).toHaveClass("active");
  });
});
