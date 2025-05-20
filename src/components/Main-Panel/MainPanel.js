import React from "react";
import MainPanelContainer from "../Main-Panel-Container/MainPanelContainer";
import BreadCrumbs from "../BreadCrumbs/BreadCrumbs";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { toggleSidenav } from "../../redux-store/slice/sidenav-slice";

import "./styles.scss";

function MainPanel() {
  const isSidenavOpen = useSelector((state) => state?.sidenav?.isOpen);
  const isLoggedIn = useSelector((state) => state?.login?.isLoggedIn);
  const dispatch = useDispatch();

  const handleSidenavToggle = () => {
    dispatch(toggleSidenav());
  };

  return (
    <div
      className={`main-panel ${
        isSidenavOpen ? "shifted h-100 w-100" : "h-100 w-100"
      }`}
    >
      <div className="main-panel__breadcrumbs h-10 w-100 row p-0 m-0 d-flex flex-column align-items-center">
        {!isSidenavOpen && (
          <IconButton
            className={!isSidenavOpen ? "main-panel__menu-icon w-10 h-100" : "d-none"}
            onClick={() => isLoggedIn && handleSidenavToggle()}
          >
            <MenuIcon />
          </IconButton>
        )}
        <BreadCrumbs />
      </div>
      <div
        className={
          isSidenavOpen
            ? "main-panel__container w-100 h-100 row-9 p-0 m-auto"
            : "main-panel__container w-100 h-100 row-12 p-0 m-auto"
        }
      >
        <MainPanelContainer>
          <Outlet />
        </MainPanelContainer>
      </div>
    </div>
  );
}

export default MainPanel;
