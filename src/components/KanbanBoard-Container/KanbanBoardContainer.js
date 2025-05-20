import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTicketStatus } from '../../redux-store/slice/ticket-slice';
import KanbanBoard from '../KanbanBoard/KanbanBoard';

import './styles.scss';

const statuses = ['open', 'in-progress', 'in-review', 'completed'];

const statusLabels = {
  open: 'Open Ticket',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  completed: 'Completed',
};

const KanbanBoardContainer = () => {
  const tickets = useSelector((state) => state.tickets.tickets);
  const dispatch = useDispatch();

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateTicketStatus({ id, status: newStatus }));
  };

  return (
    <KanbanBoard
      tickets={tickets}
      statuses={statuses}
      statusLabels={statusLabels}
      onStatusChange={handleStatusChange}
    />
  );
};

export default KanbanBoardContainer;
