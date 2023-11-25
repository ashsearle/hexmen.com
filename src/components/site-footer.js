import React from "react";
import moment from "moment";

export default () => {
  return (
    <div id="site-footer">
      <div className="container">&copy; {moment().format("YYYY")} Ash Searle</div>
    </div>
  );
};
