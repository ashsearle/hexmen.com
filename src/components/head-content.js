import React from "react";
import Helmet from "react-helmet";
import useSiteMetadata from "../hooks/use-site-metadata.js";

export default function HeadContent(props) {
  const siteMetadata = useSiteMetadata();
  const { siteUrl } = siteMetadata;

  const { pageContext, frontmatter } = props;

  const description = frontmatter?.excerpt || siteMetadata.description;
  const slug = pageContext?.slug;
  const url = `${siteUrl}${slug}`;
  const ogType = slug ? "article" : "website";

  const metaNamedProperties = {
    author: siteMetadata.author,
    description: description,
    "twitter:card": "summary",
    "twitter:site": siteMetadata.social.twitter,
    ...props.metaNamedProperties,
  };
  const metaProperties = {
    // Open Graph uses 'property' attribute:
    "og:url": url,
    "og:type": ogType,
    "og:title": frontmatter?.title || siteMetadata.title,
    "og:description": description,
    "og:image": `${siteUrl}/images/profile-ash.jpg`,
    "og:image:alt": "Wet plate portrait photo",
    "og:updated_time": new Date().toISOString(),
    ...(frontmatter?.date && { "article:published_time": frontmatter.date }),
    ...(frontmatter?.modified && { "article:modified_time": frontmatter.modified }),
    ...props.metaProperties,
  };
  return (
    <Helmet htmlAttributes={{ lang: "en-GB" }}>
      <title>{frontmatter?.title ? `${frontmatter.title} - Hexmen` : siteMetadata.title}</title>
      <link rel="shortcut icon" href={`${siteUrl}/favicon-32x32.png`} />
      {Object.entries(metaNamedProperties).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}
      {Object.entries(metaProperties).map(([property, content]) => (
        <meta key={property} property={property} content={content} />
      ))}
    </Helmet>
  );
}
