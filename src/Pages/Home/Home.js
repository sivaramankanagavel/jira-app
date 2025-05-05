import React from "react";
import SideNav from "../../components/SideNav/SideNav";
import MainPanel from "../../components/Main-Panel/MainPanel";
import { Routes, Route } from "react-router-dom";
import Login from "../Login/Login";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import Projects from "../Projects/Projects";
import Admin from "../Admin/Admin";

import "./styles.scss";
import IndividualProject from "../IndividualProject/IndividualProject";


function Home() {
  return (
    <div className="home-container w-100 col-12 p-0 m-0">
      <div className="home-container__main w-100 row col-12 p-0 m-0">
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
            <Route
              path="projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="projects/:projectId"
              element={
                <ProtectedRoute>
                  <IndividualProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default Home;
