import React from "react";
import { Link } from "gatsby";
import { HeadContent } from "../components";
import logoDataURI from "./hexmen-logo-2020-10-13.svg";

export default function Layout(props) {
  const { pageContext = {}, frontmatter = {} } = props;
  const { slug } = pageContext;

  return (
    <>
      <HeadContent pageContext={pageContext} frontmatter={frontmatter} />
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
