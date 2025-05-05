import React from "react";
import MainPanelContainer from "../Main-Panel-Container/MainPanelContainer";
import BreadCrumbs from "../BreadCrumbs/BreadCrumbs";
import { Outlet } from "react-router-dom";

import "./styles.scss";

function MainPanel() {
  return (
    <div className="main-panel d-block w-75 h-100 row col-9 p-0 m-auto">
      <div className="main-panel__breadcrumbs h-10 w-100 col row-3 p-0 m-auto">
        <BreadCrumbs />
      </div>
      <div className="main-panel__container w-100 h-90 col row-9 p-0 m-auto">
        <MainPanelContainer>
          <Outlet />
        </MainPanelContainer>
      </div>
    </div>
  );
}

export default MainPanel;
