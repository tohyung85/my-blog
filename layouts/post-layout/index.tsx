import React, { ReactNode } from "react";
import styles from "./post-layout.module.scss";
import Topbar from "../../components/topbar";

export interface PostLayoutProps {
  children?: ReactNode;
}

export default function PostLayout({ children }: PostLayoutProps) {
  return (
    <div>
      <Topbar title="Typical Wednesday" />
      <div className={styles.container}>{children}</div>
    </div>
  );
}
