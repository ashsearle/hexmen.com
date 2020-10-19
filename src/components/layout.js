import React from "react";
import Helmet from "react-helmet";
import { Link } from "gatsby";
import useSiteMetadata from "../hooks/use-site-metadata.js";
import logoDataURI from "./hexmen-logo-2020-10-13.svg";

export default function (props) {
  const { pageContext = {}, frontmatter = {} } = props;
  const { slug } = pageContext;
  const meta = useSiteMetadata();
  const { title = "" } = frontmatter;

  return (
    <>
      <Helmet>
        <title>{title} | Hexmen</title>
        <link rel="canonical" href={`${meta.siteUrl}${slug}`} />
      </Helmet>
      <header
        className="branding"
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1rem",
            lineHeight: 1.2,
          }}
        >
          <img style={{ height: "1em" }} src={logoDataURI} alt="" />
          <span>Hexmen</span>
        </h1>
        <div className="line-layout gap-s">
          {slug === "/about/" ? null : <Link to="/about/">About</Link>}
          {slug === "/contact/" ? null : <Link to="/contact/">Contact</Link>}
        </div>
      </header>
      <main>{props.children}</main>
    </>
  );
}
