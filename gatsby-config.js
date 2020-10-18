module.exports = {
  siteMetadata: {
    siteUrl: "https://hexmen.com",
    social: {
      twitter: "@hexmen",
    },
  },
  // Temporary prefix so we can test things in production before big-bang
  pathPrefix: "/g",
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [`gatsby-remark-vscode`, "gatsby-remark-copy-linked-files"],
      },
    },
  ],
};
