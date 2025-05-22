import React, { useEffect, useMemo } from "react";
import { Button, IconButton, Avatar } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutWithGoogle } from "../../redux-store/slice/login-slice";
import { toggleSidenav } from "../../redux-store/slice/sidenav-slice";
import SideNavMenu from "../Side-Nav-Menu/SideNavMenu";
import { Tooltip } from "react-tooltip";
import "./styles.scss";

function SideNav({ signInText }) {
  const isLoggedIn = useSelector((state) => state?.login?.isLoggedIn);
  const user = useSelector((state) => state?.login?.user);
  const sidenavOpen = useSelector((state) => state?.sidenav?.isOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Memoize user to avoid unnecessary re-renders
  const memoUser = useMemo(() => user, [user]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleLogOut = (event) => {
    event.preventDefault();
    dispatch(logoutWithGoogle());
    dispatch(toggleSidenav());
  };

  const handleSideNavToggle = () => {
    dispatch(toggleSidenav());
  };

  return (
    <div className={`side-nav-bar${sidenavOpen ? " open" : ""}`}>
      {sidenavOpen && (
        <div className="row col-12 d-flex justify-content-end align-items-end">
          <IconButton
            aria-label="sidenav-close"
            className="w-25 side-nav-bar__close"
            onClick={handleSideNavToggle}
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}
      {isLoggedIn && (
        <div className="d-flex flex-row flex-wrap justify-content-center align-items-center side-nav-bar__user-name">
          <Avatar
            alt={memoUser?.displayName}
            src={memoUser?.photoURL}
            sx={{ width: 35, height: 35 }}
            id="user-name"
          />
          <div>{memoUser?.displayName}</div>
          <Tooltip anchorSelect="#user-name">{memoUser?.displayName}</Tooltip>
        </div>
      )}
      {isLoggedIn && (
        <div className="side-nav-bar__menu">
          <SideNavMenu />
        </div>
      )}
      <div className="side-nav-bar__sign-in">
        {!isLoggedIn ? (
          <Button
            variant="contained"
            color="primary"
            endIcon={<LoginIcon />}
            component={Link}
            to="/login"
          >
            {signInText}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            endIcon={<LogoutIcon />}
            component={Link}
            to="/login"
            onClick={handleLogOut}
          >
            Log Out
          </Button>
        )}
      </div>
    </div>
  );
}

export default SideNav;
