import React from "react";
import { graphql, Link } from "gatsby";
import moment from "moment";
import Layout from "../components/layout.js";
import "../pages/style.css";

const BlogNav = ({ previous, next }) => {
  if (!previous && !next) {
    return null;
  }
  return (
    <nav>
      <div className="container">
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            listStyle: "none",
            padding: 0,
            marginLeft: 0,
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
      </div>
    </nav>
  );
};

export default function BlogPostTemplate(props) {
  const { pageContext, data } = props;
  const { markdownRemark } = data;
  const { previous, next } = pageContext;
  const { frontmatter } = markdownRemark;
  const publishedDate = moment(frontmatter.date).format("D MMM YYYY");
  return (
    <Layout pageContext={pageContext} frontmatter={frontmatter}>
      <article>
        <div className="container">
          <h1>{frontmatter.title}</h1>
          <div className="byline">
            <time dateTime={frontmatter.date}>{publishedDate}</time> | {markdownRemark.timeToRead}{" "}
            min read
          </div>
          <div dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
        </div>
      </article>
      <BlogNav previous={previous} next={next} />
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
        blurb
        date
        modified
      }
    }
  }
`;
