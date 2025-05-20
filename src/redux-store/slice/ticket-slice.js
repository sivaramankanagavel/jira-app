import { createSlice } from '@reduxjs/toolkit';

const statusInitialState = {
  tickets: [
    { id: '1', title: 'Fix login bug', status: 'open' },
    { id: '2', title: 'Design landing page', status: 'in-progress' },
    { id: '3', title: 'Code review', status: 'in-review' },
    { id: '4', title: 'Deploy to prod', status: 'completed' },
  ],
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: statusInitialState,
  reducers: {
    updateTicketStatus: (state, action) => {
      const { id, status } = action.payload;
      const ticket = state.tickets.find((t) => t.id === id);
      if (ticket) {
        ticket.status = status;
      }
    },
  },
});

export const { updateTicketStatus } = ticketsSlice.actions;
export default ticketsSlice;
