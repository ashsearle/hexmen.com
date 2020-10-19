import React from "react";
import { Link } from "gatsby";
import moment from "moment";
import logoDataURI from "./hexmen-logo-2020-10-13.svg";
import "./style.css";

export default function (props) {
  const recentPosts = props.data.allMarkdownRemark.nodes;
  return (
    <>
      <header className="branding">
        <h1 style={{ display: "flex", alignItems: "center", fontSize: "2rem", lineHeight: 1.2 }}>
          <img style={{ height: "1em" }} src={logoDataURI} />
          <span>Hexmen</span>
        </h1>
      </header>
      <main>
        <section id="recent">
          <h2>Recent posts</h2>
          {recentPosts.map((post) => (
            <article key={post.id}>
              <header>
                <h3>
                  <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
                </h3>
                <span className="post-meta">
                  <time dateTime={post.frontmatter.date}>
                    {moment(post.frontmatter.date).fromNow()}
                  </time>{" "}
                  {" | "} {post.timeToRead} min read
                </span>
              </header>
            </article>
          ))}
        </section>
      </main>
      <nav id="site-footer">
        <Link to="/about/">About</Link>
        <Link to="/contact/">Contact</Link>
        {/* <Link to="/blog/">Blog</Link> */}
      </nav>
    </>
  );
}

export const pagesQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { source: { eq: "blog" } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 5
    ) {
      nodes {
        id
        timeToRead
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
