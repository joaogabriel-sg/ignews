import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { getPrismicClient } from "../../services/prismic";

import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";

jest.mock("next-auth/react");
jest.mock("next/router");
jest.mock("../../services/prismic");

const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post content</p>",
  updatedAt: "10 de Abril",
};

describe("Post preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "loading",
    });

    render(<PostPreview post={post} />);

    expect(screen.getByText(/my new post/i)).toBeInTheDocument();
    expect(screen.getByText(/post content/i)).toBeInTheDocument();
    expect(screen.getByText(/wanna continue reading?/i)).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);

    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-subscription",
      },
      status: "authenticated",
    } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        uid: "my-new-post",
        data: {
          title: [{ type: "heading", text: "My New Post" }],
          content: [{ type: "paragraph", text: "Post content" }],
        },
        last_publication_date: "04-01-2021",
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My New Post",
            content: "<p>Post content</p>",
            updatedAt: "01 de abril de 2021",
          },
        },
      })
    );
  });
});
