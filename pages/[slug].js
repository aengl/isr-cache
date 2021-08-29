import fs from "fs";
import styles from "../styles/Home.module.css";
import fetch from "node-fetch";

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
    const buildId = fs.readFileSync(".next/BUILD_ID").trim();
    debug += `Build ID: ${buildId}`;
    const result = await fetch(
      `https://isr-cache.vercel.app/_next/data/${buildId}/${slug}.json`
    );
    const data = await result.json();
    debug += `\n\nhttps://isr-cache.vercel.app/_next/data/${buildId}/${slug}.json\n\n${JSON.stringify(
      data,
      undefined,
      2
    )}`;

    // debug = JSON.stringify(fs.readdirSync(".next"), undefined, 2);
    // debug = JSON.stringify(fs.readdirSync(".next/server"), undefined, 2);
    // debug += `\n\nBUILD_ID\n\n${fs.readFileSync(".next/BUILD_ID")}`;
    // debug += `\n\nbuild-manifest.json\n\n${fs.readFileSync(
    //   ".next/build-manifest.json"
    // )}`;
    // debug += `\n\nprerender-manifest.json\n\n${fs.readFileSync(
    //   ".next/prerender-manifest.json"
    // )}`;
    // debug += `\n\nreact-loadable-manifest.json\n\n${fs.readFileSync(
    //   ".next/react-loadable-manifest.json"
    // )}`;
    // debug += `\n\nroutes-manifest.json\n\n${fs.readFileSync(
    //   ".next/routes-manifest.json"
    // )}`;
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
