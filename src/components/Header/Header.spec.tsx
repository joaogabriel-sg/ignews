import { render, screen } from "@testing-library/react";

import { Header } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return {
        data: null,
        loading: "loading",
      };
    },
  };
});

describe("Header component", () => {
  it("renders correctly", () => {
    render(<Header />);

    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/posts/i)).toBeInTheDocument();
  });
});
