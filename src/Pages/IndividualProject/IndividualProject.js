import React from "react";
import { useSelector } from "react-redux";

import "./styles.scss";
import KanbanBoardContainer from "../../components/KanbanBoard-Container/KanbanBoardContainer";

function IndividualProject() {
  return (
    <div>
      <KanbanBoardContainer />
    </div>
  );
};

export default IndividualProject;