import React from "react";
import "./styles.scss";

function MainPanelContainer({ children }) {
  return <div className="h-100 row d-flex flex-wrap w-100 p-0 m-auto">{children}</div>;
}

export default MainPanelContainer;
