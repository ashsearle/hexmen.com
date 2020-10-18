import React from "react";
import { Link } from "gatsby";
import "./style.css";

export default function (props) {
  return (
    <>
      <main>Hexmen</main>
      <nav id="site-footer">
        <Link to="/about/">About</Link>
        <Link to="/contact/">Contact</Link>
        <Link to="/blog/">Blog</Link>
      </nav>
    </>
  );
}
