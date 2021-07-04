import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import React, { MouseEventHandler } from "react";
import styles from "./topbar.module.scss";
import TopbarTitle from "./topbar-title";
import { useState } from "react";

export interface TopbarProps {
  title: string;
  large?: boolean;
}

export default function Topbar(
  { title, large }: TopbarProps = { large: false, title: "" }
) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleMenu: MouseEventHandler<HTMLElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menuAppbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link style={{ textDecoration: "none", color: "black" }} href="/">
                All Posts
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link
                style={{ textDecoration: "none", color: "black" }}
                href="https://www.joshua-tan.com"
              >
                About Me
              </Link>
            </MenuItem>
          </Menu>
          <Typography variant="h6" className={styles.title}>
            <Link className={styles.titleText} href="/">
              {title}
            </Link>
          </Typography>
        </div>
        {large && <TopbarTitle />}
        {/* <div className={styles.categories}>
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
        </div> */}
      </div>
    </div>
  );
}
