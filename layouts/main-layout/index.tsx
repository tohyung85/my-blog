import React, { ReactNode } from "react";
import styles from "./main-layout.module.scss";
import Topbar from "../../components/topbar";

export interface MainLayoutProps {
  children?: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={styles.container}>
      <Topbar title="My Blog" large />
      {children}
    </div>
  );
}
