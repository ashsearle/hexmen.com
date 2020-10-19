import React from "react";
import { graphql, Link } from "gatsby";
import moment from "moment";
import Layout from "../components/layout.js";
import "../pages/style.css";

const isProduction = process.env.NODE_ENV === "production";

const BlogNav = ({ previous, next }) => {
  if (!previous && !next) {
    return null;
  }
  return (
    <nav>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          listStyle: "none",
          padding: 0,
        }}
      >
        <li>
          {previous && (
            <Link to={`${previous.fields.slug}`} rel="prev" style={{ marginRight: 20 }}>
              ← {previous.frontmatter.title}
            </Link>
          )}
        </li>
        <li>
          {next && (
            <Link to={`${next.fields.slug}`} rel="next">
              {next.frontmatter.title} →
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default function (props) {
  const { previous, next } = props.pageContext;
  const publishedDate = moment(props.data.markdownRemark.frontmatter.date).format("D MMM YYYY");
  return (
    <Layout>
      <h1>{props.data.markdownRemark.frontmatter.title}</h1>
      <div className="byline">
        <time dateTime={props.data.markdownRemark.frontmatter.date}>{publishedDate}</time> |{" "}
        {props.data.markdownRemark.timeToRead} min read
      </div>
      <div dangerouslySetInnerHTML={{ __html: props.data.markdownRemark.html }} />
      <BlogNav previous={previous} next={next} />

      {isProduction ? null : (
        <pre>
          <code>{JSON.stringify(props, null, 2)}</code>
        </pre>
      )}
    </Layout>
  );
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      frontmatter {
        title
        date
      }
    }
  }
`;
