import { graphql, useStaticQuery } from "gatsby";

const useSiteMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
          author
          title
          description
          social {
            twitter
          }
        }
      }
    }
  `);

  return data.site.siteMetadata;
};

export default useSiteMetadata;
