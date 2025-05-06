import React, { useEffect } from "react";
import { Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutWithGoogle } from "../../redux-store/slice/login-slice";
import Avatar from "@mui/material/Avatar";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import SideNavMenu from "../Side-Nav-Menu/SideNavMenu";

import "./styles.scss";

function SideNav({ signInText }) {
  const isLoggedIn = useSelector((state) => state?.login?.isLoggedIn);
  const user = useSelector((state) => state?.login?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = (event) => {
    event.preventDefault();
    dispatch(logoutWithGoogle());
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);
  return (
    <div className="side-nav-bar w-25 h-100 row col-2 p-0 m-auto d-flex align-items-center flex-wrap">
      {isLoggedIn && (
        <div className="d-flex flex-row flex-wrap justify-content-center align-items-center side-nav-bar__user-name">
          <Avatar
            alt={user?.displayName}
            src={user.photoURL}
            sx={{ width: 35, height: 35 }}
            id="user-name"
          />
          <div>{user?.displayName}</div>
          <Tooltip anchorSelect="#user-name">{user?.displayName}</Tooltip>
        </div>
      )}
      {isLoggedIn && (
        <div className="side-nav-bar__menu">
          <SideNavMenu />
        </div>
      )}
      <div className="side-nav-bar__sign-in">
        {!isLoggedIn && (
          <Button
            variant="contained"
            color="primary"
            endIcon={<LoginIcon />}
            component={Link}
            to="/login"
          >
            {signInText}
          </Button>
        )}
        {isLoggedIn && (
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
