import React from "react";
import { graphql } from "gatsby";
import moment from "moment";
import { HeadContent, Branding, SiteFooter, BlogNav } from "../../components";
import "../style.css";

export default function BlogHomepage(props) {
  const [mostRecentPost, previousPost] = props.data.allMarkdownRemark.nodes;
  const { frontmatter } = mostRecentPost;
  const publishedDate = moment(frontmatter.date).format("D MMM YYYY");
  return (
    <>
      <HeadContent frontmatter={frontmatter} />
      <Branding slug="/blog/" />
      <main>
        <article>
          <div className="container">
            <h1>{frontmatter.title}</h1>
            <div className="byline">
              <time dateTime={frontmatter.date}>{publishedDate}</time> | {mostRecentPost.timeToRead}{" "}
              min read
            </div>
            <div dangerouslySetInnerHTML={{ __html: mostRecentPost.html }} />
          </div>
        </article>
        <BlogNav previous={previousPost} />
      </main>
      <SiteFooter />
    </>
  );
}

export const pagesQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { source: { eq: "blog" } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 2
    ) {
      nodes {
        id
        timeToRead
        html
        fields {
          slug
        }
        frontmatter {
          title
          blurb
          date
          modified
        }
      }
    }
  }
`;
