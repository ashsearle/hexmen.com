import React from "react";
import { Link } from "gatsby";

export default function (props) {
  return (
    <>
      <main>{props.children}</main>
      <nav id="site-footer">
        <Link to="/about/">About</Link>
        <Link to="/contact/">Contact</Link>
        <a href="/blog/">Blog</a>
      </nav>
    </>
  );
}
