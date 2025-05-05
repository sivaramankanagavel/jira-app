import React from "react";
import "./styles.scss";

function MainPanelContainer({ children }) {
  return <div className="w-100 h-100 col-9 row d-flex justify-content-center align-item-center">{children}</div>;
}

export default MainPanelContainer;
