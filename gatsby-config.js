module.exports = {
  siteMetadata: {
    siteUrl: "https://hexmen.com",
    author: "Ash Searle",
    title: "Hexmen — Full stack development",
    description:
      "Over 20 years industry experience including React, Node.js, AngularJS, Jamstack; skilled at evolving legacy code in addition to creating greenfield projects.",
    social: {
      twitter: "@hexmen",
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/blog`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          `gatsby-remark-vscode`,
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-plugin-typography",
      options: {
        pathToConfigModule: "src/utils/typography",
      },
    },
    `gatsby-plugin-sitemap`,
  ],
};
