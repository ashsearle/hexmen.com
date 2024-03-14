import React from "react";
import { Branding, HeadContent } from "../components";
import "./typography.css";

export default function Layout(props) {
  const { pageContext = {}, frontmatter = {} } = props;
  const { slug } = pageContext;

  return (
    <>
      <HeadContent pageContext={pageContext} frontmatter={frontmatter} />
      <Branding slug={slug} />
      <main>{props.children}</main>
    </>
  );
}
