import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

import { SubscribeButton } from ".";

jest.mock("next-auth/react");
jest.mock("next/router");

describe("SubscribeButton", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });

    render(<SubscribeButton />);

    expect(screen.getByText(/subscribe now/i)).toBeInTheDocument();
  });

  it("redirects user to sign in when NOT authenticated", () => {
    const signInMocked = jest.mocked(signIn);
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText(/subscribe now/i);

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects user to posts when user already has a subscription", () => {
    const useRouterMocked = jest.mocked(useRouter);
    const useSessionMocked = jest.mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "john.doe@example.com" },
        expires: "fake-expires",
        activeSubscription: "fake-active-subscription",
      },
      status: "authenticated",
    });

    useRouterMocked.mockReturnValueOnce({ push: pushMock } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText(/subscribe now/i);

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});
