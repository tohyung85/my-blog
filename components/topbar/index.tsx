import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import styles from "./topbar.module.scss";
import TopbarTitle from "./topbar-title";

export interface TopbarProps {
  title: string;
  large?: boolean;
}

export default function Topbar(
  { title, large }: TopbarProps = { large: false, title: "" }
) {
  return (
    <div
      className={styles.container}
      style={{ minHeight: large ? "30vh" : "0" }}
    >
      <div className={styles.content}>
        <div className={styles.appBar}>
          <IconButton
            edge="start"
            className={styles.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={styles.title}>
            <Link className={styles.titleText} href="/">
              {title}
            </Link>
          </Typography>
        </div>
        {large && <TopbarTitle />}
        <div className={styles.categories}>
          <Typography variant="h6" className={styles.catItems}>
            <Link className={styles.itemText} href="#">
              AWS
            </Link>
          </Typography>
          <Typography variant="h6" className={styles.catItems}>
            <Link className={styles.itemText} href="#">
              Frontend
            </Link>
          </Typography>
          <Typography variant="h6" className={styles.catItems}>
            <Link className={styles.itemText} href="#">
              Backend
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}
