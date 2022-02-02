import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";

import { SignInButton } from ".";

jest.mock("next-auth/react");

describe("SignInButton component", () => {
  it("renders correctly when user is NOT authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });

    render(<SignInButton />);

    expect(screen.getByText(/sign in with github/i)).toBeInTheDocument();
  });

  it("renders correctly when user is authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "john.doe@example.com" },
        expires: "fake-expires",
      },
      status: "authenticated",
    });

    render(<SignInButton />);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });
});
