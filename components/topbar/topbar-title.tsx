import { Typography } from "@material-ui/core";
import React from "react";
import styles from "./topbar.module.scss";

export default function TopbarTitle() {
  return (
    <div className={styles.topbarTitle}>
      <Typography className={styles.titleText} variant="h2">
        A Coder's Blog
      </Typography>
      <Typography className={styles.titleText} variant="h4">
        Here to learn
      </Typography>
    </div>
  );
}
