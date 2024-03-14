import { Link } from "gatsby";
import React from "react";

const BlogNav = ({ previous, next }) => {
  if (!previous && !next) {
    return null;
  }
  return (
    <nav>
      <div className="container">
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            listStyle: "none",
            padding: 0,
            marginLeft: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={`${previous.fields.slug}`} rel="prev" style={{ marginRight: 20 }}>
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={`${next.fields.slug}`} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default BlogNav;
