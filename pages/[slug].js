import fs from "fs";
import styles from "../styles/Home.module.css";
import fetch from "node-fetch";

const requestPagePropsForPath = async (path) => {
  try {
    const buildId = fs.readFileSync(".next/BUILD_ID", "utf-8").trim();
    const result = await fetch(
      `https://isr-cache.vercel.app/_next/data/${buildId}/${path}.json`
    );
    const data = await result.json();
    return data.pageProps;
  } catch {
    return {};
  }
};

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
    return {
      props: {
        ...(await requestPagePropsForPath(slug)),
        debug: "Success! " + process.env.CI,
      },
      revalidate: 10,
    };
  } catch (error) {
    debug = error.message + process.env.CI;
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
