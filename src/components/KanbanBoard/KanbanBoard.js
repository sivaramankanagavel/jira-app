import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Paper, Typography, Card, CardContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateTaskStatus } from "../../redux-store/slice/tasks-slice";
import { getTickets } from "../../redux-store/slice/tasks-slice";

import "./styles.scss";

const KanbanBoard = () => {
  const tickets = useSelector((state) => state?.ticketsData?.tickets);
  const projectId = useSelector((state) => state?.ticketsData?.projectId);
  const userData = useSelector((state) => state?.loginEndpoint?.userData);
  const dispatch = useDispatch();

  const statuses = ["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "COMPLETED"];
  const statusLabels = {
    NOT_STARTED: "Open Ticket",
    IN_PROGRESS: "In Progress",
    BLOCKED: "Blocked",
    COMPLETED: "Completed",
  };

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    dispatch(
      updateTaskStatus({
      userId: userData.userId,
      projectId: projectId,
      taskId: Number(draggableId),
      status: destination.droppableId,
      })
    ).then(() => {
      dispatch(getTickets({ projectId: projectId, userId: userData.userId }));
    });
  };

  return (
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
                  backgroundColor: "#f4f4f4",
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
                      key={ticket.id}
                      draggableId={String(ticket.id)}
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
  );
};

export default KanbanBoard;
