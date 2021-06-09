import styles from "./styles/index.module.scss";
import PostSummarySection from "../components/post-summary-section";
import { getAllPosts } from "./api/posts";
import MainLayout from "../layouts/main-layout";

export interface HomeProps {
  allPosts?: any;
}

export default function Home({ allPosts }: HomeProps) {
  return (
    <MainLayout>
      <PostSummarySection allPosts={allPosts} />
    </MainLayout>
  );
}
export async function getStaticProps() {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);

  return {
    props: { allPosts },
  };
}
