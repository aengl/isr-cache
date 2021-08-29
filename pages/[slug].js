import styles from "../styles/Home.module.css";

export const Test = ({ date, slug }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Welcome to <a href="https://nextjs.org">{slug}</a>
      </h1>
      <p>
        Page generated on <date>{date}</date>
      </p>
    </div>
  );
};

export default Test;

export const getStaticProps = async (context) => {
  const slug = context.params.slug;
  const date = new Date().toISOString();
  return {
    props: { date, slug },
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
