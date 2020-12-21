import React from "react";
import { Link } from "gatsby";
import LogoType from "./logo-type.js";
import "./branding.css";

const BurgerMenuIcon = ({ d }) => (
  <svg className="burger-menu-icon" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d={d}></path>
  </svg>
);
const openBurgerMenuIcon = <BurgerMenuIcon d="M4.8,9.6L27.2,9.6M4.8,22.4L27.2,22.4" />;
const closeBurgerMenuIcon = <BurgerMenuIcon d="M0,0L32,32M0,32L32,0" />;

const BurgerMenu = ({ slug, setMenuVisible }) => {
  return (
    <div className="burger-menu">
      <div className="line-layout gap-s">
        <div className="stack-layout gap-s flex-grow">
          {slug === "/blog/" ? null : <Link to="/blog/">Blog</Link>}
          {slug === "/about/" ? null : <Link to="/about/">About</Link>}
          {slug === "/contact/" ? null : <Link to="/contact/">Contact</Link>}
        </div>
        <div
          style={{
            width: "40px",
          }}
        >
          <button
            aria-label="Close menu"
            className="burger-menu-trigger"
            type="button"
            onClick={() =>
              setMenuVisible((oldValue) => {
                const newValue = !oldValue;
                console.log({ oldValue, newValue });
                return newValue;
              })
            }
            style={{
              position: "fixed",
              right: "1rem",
              top: "19px",
            }}
          >
            {closeBurgerMenuIcon}
            <div className="sr-only">Toggle mobile menu</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Branding({ slug }) {
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <header className="branding">
      <div className="container">
        <LogoType slug={slug} />
        <div className="line-layout gap-s desktop-only">
          {slug === "/about/" ? null : <Link to="/about/">About</Link>}
          {slug === "/contact/" ? null : <Link to="/contact/">Contact</Link>}
        </div>
        <div className="line-layout gap-s mobile-only">
          <button
            aria-label="Open menu"
            className="burger-menu-trigger"
            type="button"
            onClick={() => setMenuVisible((oldValue) => !oldValue)}
          >
            {openBurgerMenuIcon}
            <div className="sr-only">Toggle mobile menu</div>
          </button>
        </div>
      </div>
      {menuVisible ? <BurgerMenu slug={slug} setMenuVisible={setMenuVisible} /> : null}
    </header>
  );
}
