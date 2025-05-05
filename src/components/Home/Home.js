import React from "react";
import SideNav from "../SideNav/SideNav";
import MainPanel from "../Main-Panel/MainPanel";
import { Routes, Route } from "react-router-dom";
import Login from "../Login/Login";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import "./styles.scss";

function Home() {
  return (
    <div className="home-container row col-12 p-0">
      <div className="home-container__main row col-12 p-0">
        <SideNav signInText={"Log In"} />
        <Routes>
          <Route path="/" element={<MainPanel />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <div>Welcome To Main Panel</div>
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default Home;
