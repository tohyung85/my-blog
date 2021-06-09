import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { getPostBySlug, getAllPosts } from "../api/posts";
import Head from "next/head";
import styles from "./slug.module.scss";
import markdownToHtml from "../api/markdownToHtml";
import { GetStaticProps } from "next";
import PostLayout from "../../layouts/post-layout";
import { Typography } from "@material-ui/core";

export default function Post({ post, morePosts, preview }: any) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <PostLayout>
      <div className={styles.container}>
        <div
          className={styles.coverImage}
          style={{ backgroundImage: `url(${post.ogImage.url})` }}
        />

        <div className={styles.contentContainer}>
          <Typography variant="h4" className={styles.title}>
            {post.title}
          </Typography>
          <Typography
            variant="body1"
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </PostLayout>
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
