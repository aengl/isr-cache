import fs from "fs";
import styles from "../styles/Home.module.css";

export const Test = ({ date, debug, slug }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Welcome to <a href="https://nextjs.org">{slug}</a>
      </h1>
      <p>
        Page generated on <date>{date}</date>
      </p>
      <pre>{debug}</pre>
    </div>
  );
};

export default Test;

export const getStaticProps = async (context) => {
  const slug = context.params.slug;
  const date = new Date().toISOString();
  let debug = "";
  try {
    debug = JSON.stringify(fs.readdirSync("."), undefined, 2);
  } catch (error) {
    debug = error.message;
  }
  return {
    props: { date, debug, slug },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  return {
    fallback: false,
    paths: [
      { params: { slug: "foo" } },
      { params: { slug: "bar" } },
      { params: { slug: "baz" } },
    ],
  };
};
