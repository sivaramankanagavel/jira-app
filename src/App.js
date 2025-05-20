import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";

import "./app.scss";

function App() {
  return (
    <div className="App row-12 w-100 p-0 m-0">
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
