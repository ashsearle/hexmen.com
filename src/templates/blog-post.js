import { graphql } from "gatsby";
import moment from "moment";
import React from "react";
import { BlogNav, Layout } from "../components";
import "../pages/style.css";

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
