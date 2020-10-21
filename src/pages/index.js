import React from "react";
import { graphql, Link } from "gatsby";
import moment from "moment";
import { HeadContent, SiteFooter } from "../components";
import logoDataURI from "../components/hexmen-logo-2020-10-13.svg";
import "./style.css";

export default function Homepage(props) {
  const recentPosts = props.data.allMarkdownRemark.nodes;
  return (
    <>
      <HeadContent />
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
      <SiteFooter />
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
