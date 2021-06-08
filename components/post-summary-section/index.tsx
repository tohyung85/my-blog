import React from "react";
import styles from "./post-summary.module.scss";
import Grid from "@material-ui/core/Grid";
import SummaryCard from "./summary-card";
import { Post } from "./summary-card/index";

export interface PostSummarySectionProps {
  allPosts: Post[];
}

export default function PostSummarySection({
  allPosts,
}: PostSummarySectionProps) {
  const renderPosts = (allPosts: Post[]) => {
    return allPosts.map((p) => {
      return (
        <Grid
          className={styles.gridItem}
          item
          key={p.slug}
          xs={12}
          sm={6}
          lg={4}
        >
          <SummaryCard post={p} />
        </Grid>
      );
    });
  };

  return (
    <div className={styles.section}>
      <Grid container spacing={1} className={styles.grid}>
        {allPosts ? renderPosts(allPosts) : "Loading"}
      </Grid>
    </div>
  );
}
