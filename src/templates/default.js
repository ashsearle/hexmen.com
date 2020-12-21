import React from "react";
import { graphql } from "gatsby";
import { SiteFooter, Layout } from "../components/";
import "../pages/style.css";

export default function DefaultTemplate(props) {
  const { pageContext } = props;
  return (
    <Layout pageContext={pageContext}>
      <div className="container">
        <h1>{props.data.markdownRemark.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: props.data.markdownRemark.html }} />
      </div>
      <SiteFooter />
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
