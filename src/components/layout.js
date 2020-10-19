import React from "react";
import { Link } from "gatsby";
import logoDataURI from "./hexmen-logo-2020-10-13.svg";

export default function (props) {
  return (
    <>
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
        <div
          style={{
            display: "flex",
            gap: "1ch",
          }}
        >
          <Link to="/about/">About</Link>
          <Link to="/contact/">Contact</Link>
        </div>
      </header>
      <main>{props.children}</main>
    </>
  );
}
