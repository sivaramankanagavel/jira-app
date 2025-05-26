import React from "react";
import { useDispatch, useSelector } from "react-redux";
import KanbanBoard from "../KanbanBoard/KanbanBoard";

import "./styles.scss";

const KanbanBoardContainer = () => {
  return <KanbanBoard />;
};

export default KanbanBoardContainer;
