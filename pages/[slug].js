import fs from "fs";
import styles from "../styles/Home.module.css";
import fetch from "node-fetch";

const useCachedProps =
  process.env.NODE_ENV === "production" && process.env.CI === undefined;

const requestPagePropsForPath = async (path) => {
  const buildId = fs.readFileSync(".next/BUILD_ID", "utf-8").trim();
  const result = await fetch(
    `https://isr-cache.vercel.app/_next/data/${buildId}/${path}.json`
  );
  const data = await result.json();
  return data.pageProps;
};

export const Test = ({ dateGenerated, dateRevalidated, slug }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Welcome to <a href="https://nextjs.org">{slug}</a>
      </h1>
      <p>
        Page generated on <date>{dateGenerated}</date>
      </p>
      {dateRevalidated && (
        <p>
          Page revalidated on <date>{dateRevalidated}</date>
        </p>
      )}
    </div>
  );
};

export default Test;

export const getStaticProps = async (context) => {
  const slug = context.params.slug;
  const dateGenerated = new Date().toISOString();

  // ISR
  if (useCachedProps) {
    await fetch("https://isr-cache.vercel.app/api/hello", {
      body: JSON.stringify({ message: `Triggered ISR for "${slug}"` }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    return {
      props: {
        ...(await requestPagePropsForPath(slug)),
        dateRevalidated: new Date().toISOString(),
      },
      revalidate: 10,
    };
  }

  // Build-time props
  return {
    props: { dateGenerated, slug },
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
