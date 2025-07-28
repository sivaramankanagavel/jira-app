import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Paper, Typography, Card, CardContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTaskStatus,
  getTickets,
} from "../../redux-store/slice/tasks-slice";
import CircularProgress from "@mui/material/CircularProgress";

import "./styles.scss";

const KanbanBoard = () => {
  const tickets = useSelector((state) => state?.ticketsData?.tickets);
  const projectId = useSelector((state) => state?.ticketsData?.projectId);
  const userData = useSelector((state) => state?.auth?.userData);
  const isPending = useSelector((state) => state?.ticketsData?.isPending);
  const dispatch = useDispatch();

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timer;
    if (isPending) {
      setShowSpinner(true);
      timer = setTimeout(() => {
        if (!isPending) setShowSpinner(false);
      }, 500);
    } else {
      timer = setTimeout(() => setShowSpinner(false), 500);
    }
    return () => clearTimeout(timer);
  }, [isPending]);

  const statuses = ["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "COMPLETED"];
  const statusLabels = {
    NOT_STARTED: "Open Ticket",
    IN_PROGRESS: "In Progress",
    BLOCKED: "Blocked",
    COMPLETED: "Completed",
  };

  const onDragEnd = (result) => {
    const { destination, draggableId, source } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    // Find the dragged task's current data from your Redux store or props
    const task = tickets.find((t) => t._id === draggableId);
    if (!task) return;

    dispatch(
      updateTaskStatus({
        taskId: draggableId,
        updatedData: {
          status: destination.droppableId,
          description: task.description,
          dueDate: task.dueDate,
        },
      })
    ).then(() => {
      dispatch(getTickets({ projectId: projectId, userId: userData.userId }));
    });
  };

  return (
    <Box position="relative" width="100%" height="100%">
      {showSpinner && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          zIndex={10}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(255,255,255,0.6)"
        >
          <CircularProgress />
        </Box>
      )}
      <DragDropContext onDragEnd={onDragEnd} className="p-0">
        <Box className="kanban-board-container d-flex flex-row w-100 h-100 p-0 gap-3">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    p: 2,
                  }}
                  className="h-100 w-50 d-flex flex-column"
                >
                  <Typography variant="h6" gutterBottom>
                    {statusLabels[status] || status}
                  </Typography>
                  {tickets
                    ?.filter((ticket) => ticket.status === status)
                    ?.map((ticket, index) => (
                      <Draggable
                        key={ticket._id}
                        draggableId={String(ticket._id)}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 2, cursor: "grab" }}
                          >
                            <CardContent>
                              <Typography>{ticket.description}</Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default KanbanBoard;
