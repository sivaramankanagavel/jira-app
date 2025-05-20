import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Paper, Typography, Card, CardContent } from "@mui/material";

import "./styles.scss";

const KanbanBoard = ({
  tickets = [],
  statuses = [],
  statusLabels = {},
  onStatusChange = () => {},
}) => {
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    onStatusChange(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box className="kanban-board-container row-12 w-100 h-100 m-0 overflow-auto">
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
              >
                <Typography variant="h6" gutterBottom>
                  {statusLabels[status] || status}
                </Typography>
                {tickets
                  .filter((ticket) => ticket.status === status)
                  .map((ticket, index) => (
                    <Draggable
                      key={ticket.id}
                      draggableId={ticket.id}
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
                            <Typography>{ticket.title}</Typography>
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
