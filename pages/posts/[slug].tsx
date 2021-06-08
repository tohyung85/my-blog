import { useRouter } from "next/router";
import ErrorPage from "next/error";
// import Container from "../../components/container";
// import PostBody from "../../components/post-body";
// import Header from "../../components/header";
// import PostHeader from "../../components/post-header";
// import Layout from "../../components/layout";
import { getPostBySlug, getAllPosts } from "../api/posts";
// import PostTitle from "../../components/post-title";
import Head from "next/head";
// import { CMS_NAME } from "../../lib/constants";
import markdownToHtml from "../api/markdownToHtml";
import { GetStaticProps } from "next";

export default function Post({ post, morePosts, preview }: any) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <div>
      {post.title}
      {post.ogImage.url}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) return { props: {} };

  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
  ]);
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
};

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
