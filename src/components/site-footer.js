import React from "react";
import moment from "moment";

export default () => {
  return <div id="site-footer">&copy; {moment().format("YYYY")} Hexmen Limited</div>;
};
