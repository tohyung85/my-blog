import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import styles from "./summary-card.module.scss";
import { useRouter } from "next/router";

export interface Post {
  title: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  date: string;
  slug: string;
}

export interface PostSummaryCardProps {
  post: Post;
}

export default function PostSummaryCard({ post }: PostSummaryCardProps) {
  const router = useRouter();

  const cardClicked = (link: string) => {
    router.push(`/posts/${link}`);
  };

  return (
    <Card className={styles.root}>
      <CardActionArea
        className={styles.actionArea}
        onClick={() => cardClicked(post.slug)}
      >
        <CardMedia
          className={styles.media}
          image={post.coverImage}
          title={post.title}
        />
        <CardContent>
          <Typography
            className={styles.cardTitle}
            gutterBottom
            variant="h5"
            component="h2"
          >
            {post.title}
          </Typography>
          <Typography
            className={styles.cardContent}
            variant="body2"
            color="textSecondary"
            component="p"
          >
            {post.excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/* <CardActions>
        <Button size="small" color="secondary">
          Share
        </Button>
        <Button size="small" color="secondary">
          Learn More
        </Button>
      </CardActions> */}
    </Card>
  );
}
