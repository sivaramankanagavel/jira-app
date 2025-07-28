// src/components/__tests__/KanbanBoard.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import KanbanBoard from '../KanbanBoard/KanbanBoard';
import { updateTaskStatus, getTickets } from '../../redux-store/slice/tasks-slice';

jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children, onDragEnd }) => {
    global.mockDragEnd = onDragEnd;
    return <div>{children}</div>;
  },
  Droppable: ({ children, droppableId }) => (
    <div data-testid={`droppable-${droppableId}`}>
      {children({
        innerRef: jest.fn(),
        droppableProps: {},
        placeholder: null,
      }, { isDraggingOver: false })}
    </div>
  ),
  Draggable: ({ children, draggableId, index }) => (
    <div data-testid={`draggable-${draggableId}`}>
      {children({
        innerRef: jest.fn(),
        draggableProps: { 'data-draggableid': draggableId },
        dragHandleProps: {},
      }, { isDragging: false })}
    </div>
  ),
}));

const mockStore = configureMockStore([]);

describe('KanbanBoard', () => {
  let store;
  const initialState = {
    ticketsData: {
      tickets: [
        { _id: '1', description: 'Task 1', status: 'NOT_STARTED' },
        { _id: '2', description: 'Task 2', status: 'IN_PROGRESS' },
        { _id: '3', description: 'Task 3', status: 'BLOCKED' },
        { _id: '4', description: 'Task 4', status: 'COMPLETED' },
      ],
      projectId: 'testProjectId',
      isPending: false,
      isError: false,
    },
    auth: {
      userData: {
        userId: 'testAssigneeId',
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn().mockReturnValue(Promise.resolve());
  });

  it('renders all status columns', () => {
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    expect(screen.getByText('Not Started')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders tickets in their respective columns', () => {
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
    expect(screen.getByText('Task 4')).toBeInTheDocument();
  });

  it('dispatches updateTaskStatus and getTickets on drag end', async () => {
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    const result = {
      draggableId: '1',
      source: { droppableId: 'NOT_STARTED', index: 0 },
      destination: { droppableId: 'IN_PROGRESS', index: 0 },
      type: 'COLUMN',
    };

    global.mockDragEnd(result);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        updateTaskStatus({
          taskId: '1',
          updatedData: {
            status: 'IN_PROGRESS',
            assigneeId: 'testAssigneeId',
          },
        })
      );
      expect(store.dispatch).toHaveBeenCalledWith(getTickets({ projectId: 'testProjectId' }));
    });
  });

  it('does not dispatch if there is no destination', () => {
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    const result = {
      draggableId: '1',
      source: { droppableId: 'NOT_STARTED', index: 0 },
      destination: null,
    };

    global.mockDragEnd(result);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('does not dispatch if task is dropped in the same column', () => {
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    const result = {
      draggableId: '1',
      source: { droppableId: 'NOT_STARTED', index: 0 },
      destination: { droppableId: 'NOT_STARTED', index: 0 },
    };

    global.mockDragEnd(result);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('shows CircularProgress when isPending is true', async () => {
    const pendingState = {
      ...initialState,
      ticketsData: {
        ...initialState.ticketsData,
        isPending: true,
      },
    };
    store = mockStore(pendingState);

    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // To properly test the removal of the progress bar, you'd typically dispatch
    // an action that sets isPending to false, or re-render with a new state.
    // The current test sets a new store which effectively re-renders with the new state.
    // The waitFor with a timeout is also a valid approach.
    store = mockStore({ // Re-initialize store to reflect changed state
      ...initialState,
      ticketsData: {
        ...initialState.ticketsData,
        isPending: false,
      },
    });
    // Re-render with the updated store for the assert
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    }, { timeout: 600 });
  });
});