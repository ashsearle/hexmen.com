import { Link, graphql } from "gatsby";
import moment from "moment";
import React from "react";
import { Branding, HeadContent, SiteFooter } from "../components";
import "./style.css";

export default function Homepage(props) {
  const recentPosts = props.data.allMarkdownRemark.nodes;
  return (
    <>
      <HeadContent />
      <Branding slug="/" />
      <main>
        <section id="recent">
          <div className="container">
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
          </div>
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
