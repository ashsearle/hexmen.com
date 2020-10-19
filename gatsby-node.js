const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);

// onCreateNode is an opportunity to add fields to nodes in Gatsby GraphQL store
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === "MarkdownRemark") {
    const { sourceInstanceName } = getNode(node.parent);
    const slug = createFilePath({ node, getNode, basePath: sourceInstanceName });
    if (sourceInstanceName === "blog") {
      createNodeField({
        node,
        name: `slug`,
        value: `blog/${slug}`,
      });
    } else {
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      });
    }
  }
};

// createPages does the hard work of creating pages based on nodes
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark(
        filter: { fields: { slug: { regex: "/^blog/" } } }
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  `);

  const defaultTemplate = path.resolve("src/templates/default.js");
  result.data.allMarkdownRemark.nodes.forEach((markdownNode, index, posts) => {
    const { slug } = markdownNode.fields;
    const previous = posts[index + 1] || null;
    const next = posts[index - 1] || null;

    createPage({
      path: slug,
      component: defaultTemplate,
      context: { slug, next, previous },
    });
  });
};
