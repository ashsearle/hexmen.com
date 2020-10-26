import React from "react";
import { graphql, Link } from "gatsby";
import moment from "moment";
import { HeadContent, Branding, SiteFooter } from "../../components";
import "../style.css";

const BlogNav = ({ previous, next }) => {
  if (!previous && !next) {
    return null;
  }
  return (
    <nav>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          listStyle: "none",
          padding: 0,
        }}
      >
        <li>
          {previous && (
            <Link to={`${previous.fields.slug}`} rel="prev" style={{ marginRight: 20 }}>
              ← {previous.frontmatter.title}
            </Link>
          )}
        </li>
        <li>
          {next && (
            <Link to={`${next.fields.slug}`} rel="next">
              {next.frontmatter.title} →
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

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
          <h1>{frontmatter.title}</h1>
          <div className="byline">
            <time dateTime={frontmatter.date}>{publishedDate}</time> | {mostRecentPost.timeToRead}{" "}
            min read
          </div>
          <div dangerouslySetInnerHTML={{ __html: mostRecentPost.html }} />
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
