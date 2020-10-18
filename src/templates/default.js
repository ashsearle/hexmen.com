import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout.js";
import "../pages/style.css";

const isProduction = process.env.NODE_ENV === "production";

export default function (props) {
  return (
    <Layout>
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
      tableOfContents
      frontmatter {
        title
      }
    }
  }
`;
