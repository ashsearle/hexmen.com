import React from "react";
import { Link } from "gatsby";
import LogoType from "./logo-type.js";
import "./branding.css";

export default function Branding({ slug }) {
  return (
    <header className="branding">
      <div className="container">
        <LogoType slug={slug} />
        <div className="line-layout gap-s">
          {slug === "/about/" ? null : <Link to="/about/">About</Link>}
          {slug === "/contact/" ? null : <Link to="/contact/">Contact</Link>}
        </div>
      </div>
    </header>
  );
}
