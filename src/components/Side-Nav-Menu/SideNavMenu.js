import { useState } from "react";
import sideNavMenuData from "../../data/side-nav-menu/side-nav-menu";
import {
  List,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./styles.scss";

function SideNavMenu() {
  const [open, setOpen] = useState(false);
  const userDetails = useSelector((state) => state?.loginEndpoint?.userData);
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.name === "Projects") {
      navigate("/projects");
      setOpen(!open);
    } else if (item.name === "Admin") {
      navigate("/admin");
    } else if (item.name === "Board") {
      navigate("/board");
    } else if (item.name === "Home") {
      navigate("/");
    }
  };

  return (
    <div>
      {sideNavMenuData.map((item, index) => {
        // Only show Admin if user is admin
        if (item.name === "Admin" && userDetails?.role !== "ADMIN") return null;
        return (
          <List key={index} component="nav" aria-labelledby="Main Menu">
            <ListItemButton onClick={() => handleClick(item)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
              {item.dropdown ? open ? <ExpandLess /> : <ExpandMore /> : null}
            </ListItemButton>
            {item.dropdown && (
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding></List>
              </Collapse>
            )}
          </List>
        );
      })}
    </div>
  );
}

export default SideNavMenu;
