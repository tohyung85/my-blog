import React, { ReactNode } from "react";
import styles from "./post-layout.module.scss";
import Topbar from "../../components/topbar";
import Head from "next/head";

export interface PostLayoutProps {
  children?: ReactNode;
}

export default function PostLayout({ children }: PostLayoutProps) {
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/prismjs@0.0.1/themes/prism-okaidia.css"
        />
        {/* <link
          rel="stylesheet"
          href="https://unpkg.com/prismjs@0.0.1/themes/prism-tomorrow.css"
        /> */}
      </Head>
      <Topbar title="Typical Wednesday" />
      <div className={styles.container}>{children}</div>
    </div>
  );
}
