import moment from "moment";
import React from "react";

export default () => {
  return (
    <div id="site-footer">
      <div className="container">&copy; {moment().format("YYYY")} Ash Searle</div>
    </div>
  );
};
