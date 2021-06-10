import { Typography } from "@material-ui/core";
import React from "react";
import styles from "./topbar.module.scss";

export default function TopbarTitle() {
  return (
    <div className={styles.topbarTitle}>
      <Typography className={styles.titleText} variant="h2">
        Typical Wednesday
      </Typography>
      <Typography className={styles.titleText} variant="h4">
        A blog for regular sharing and learning of all things tech
      </Typography>
    </div>
  );
}
