import React from "react";
import { graphql, Link } from "gatsby";
import moment from "moment";
import { SiteFooter } from "../../components";
import logoDataURI from "../../components/hexmen-logo-2020-10-13.svg";
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

export default function (props) {
  const [mostRecentPost, previousPost] = props.data.allMarkdownRemark.nodes;
  const { frontmatter } = mostRecentPost;
  const publishedDate = moment(frontmatter.date).format("D MMM YYYY");
  return (
    <>
      <header className="branding">
        <h1 style={{ display: "flex", alignItems: "center", fontSize: "2rem", lineHeight: 1.2 }}>
          <img style={{ height: "1em" }} src={logoDataURI} alt="" />
          <span>Hexmen</span>
        </h1>
        <div className="line-layout gap-s">
          <Link to="/about/">About</Link>
          <Link to="/contact/">Contact</Link>
        </div>
      </header>
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
          date
        }
      }
    }
  }
`;
