import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/react";

import { getPrismicClient } from "../../services/prismic";

import Post, { getServerSideProps } from "../../pages/posts/[slug]";

jest.mock("next-auth/react");
jest.mock("../../services/prismic");

const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post content</p>",
  updatedAt: "10 de Abril",
};

describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText(/my new post/i)).toBeInTheDocument();
    expect(screen.getByText(/post content/i)).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
  });

  it("loads initial data", async () => {
    const getSessionMocked = jest.mocked(getSession);
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

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    const response = await getServerSideProps({
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
