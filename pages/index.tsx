import BlogAppBar from "../components/blog-app-bar";
import styles from "./styles/index.module.scss";
import HeroSection from "../components/hero-section";
import PostSummarySection from "../components/post-summary-section";
import { getAllPosts } from "./api/posts";

export interface HomeProps {
  allPosts?: any;
}

export default function Home({ allPosts }: HomeProps) {
  return (
    <div>
      <BlogAppBar title="A Blog" />
      <HeroSection />
      <PostSummarySection allPosts={allPosts} />
    </div>
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
