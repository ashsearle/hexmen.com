import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout.js";
import "../pages/style.css";

const isProduction = process.env.NODE_ENV === "production";

export default function (props) {
  return (
    <Layout>
      <h1>{props.data.markdownRemark.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: props.data.markdownRemark.html }} />

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
