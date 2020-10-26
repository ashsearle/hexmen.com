import React from "react";
import { Link } from "gatsby";
import logoDataURI from "./hexmen-logo-2020-10-13.svg";

export default function LogoType({ slug }) {
  const InnerContent = (
    <>
      <img style={{ height: "1em" }} src={logoDataURI} alt="" />
      <span>Hexmen</span>
    </>
  );

  return (
    <h1
      style={{
        display: "flex",
        alignItems: "center",
        fontSize: "1rem",
        lineHeight: 1.2,
      }}
    >
      {slug === "/" ? (
        InnerContent
      ) : (
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {InnerContent}
        </Link>
      )}
    </h1>
  );
}
