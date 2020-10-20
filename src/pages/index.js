import React from "react";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import moment from "moment";
import useSiteMetadata from "../hooks/use-site-metadata.js";
import { SiteFooter } from "../components";
import logoDataURI from "../components/hexmen-logo-2020-10-13.svg";
import "./style.css";

export default function (props) {
  const recentPosts = props.data.allMarkdownRemark.nodes;
  const siteMetadata = useSiteMetadata();
  const { siteUrl } = siteMetadata;
  const metaNamedProperties = {
    author: siteMetadata.author,
    description: siteMetadata.description,
    // "twitter:card": "summary",
    "twitter:site": siteMetadata.social.twitter,
  };
  const metaProperties = {
    // Open Graph uses 'property' attribute:
    "og:url": siteUrl,
    "og:type": "website",
    "og:title": siteMetadata.title,
    "og:description": siteMetadata.description,
    "og:image": "https://hexmen.com/images/profile-ash.jpg",
    "og:image:alt": "Wet plate portrait photo",
    "og:updated_time": new Date().toISOString(),
  };
  return (
    <>
      <Helmet htmlAttributes={{ lang: "en-GB" }}>
        <title>{siteMetadata.title}</title>
        {Object.entries(metaNamedProperties).map(([name, content]) => (
          <meta key={name} name={name} content={content} />
        ))}
        {Object.entries(metaProperties).map(([property, content]) => (
          <meta key={property} property={property} content={content} />
        ))}
      </Helmet>
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
