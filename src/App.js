import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";

import "./app.scss";

function App() {
  return (
    <div className="App row col-12 p-0 m-0">
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
