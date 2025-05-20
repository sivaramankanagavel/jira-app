import React from "react";
import "./styles.scss";

function MainPanelContainer({ children }) {
  return <div className="h-100 row-12 d-flex flex-wrap justify-content-center align-item-center">{children}</div>;
}

export default MainPanelContainer;
