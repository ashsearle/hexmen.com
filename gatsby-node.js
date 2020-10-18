const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);

// onCreateNode is an opportunity to add fields to nodes in Gatsby GraphQL store
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};

// createPages does the hard work of creating pages based on nodes
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          fields {
            slug
          }
        }
      }
    }
  `);

  const defaultTemplate = path.resolve("src/templates/default.js");
  result.data.allMarkdownRemark.nodes.forEach((markdownNode) => {
    const { slug } = markdownNode.fields;
    createPage({
      path: slug,
      component: defaultTemplate,
      context: { slug },
    });
  });
};
