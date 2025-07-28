// src/components/__tests__/KanbanBoardContainer.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import KanbanBoardContainer from '../KanbanBoard-Container/KanbanBoardContainer';
import { addTask, getTickets } from '../../redux-store/slice/tasks-slice';

jest.mock('../KanbanBoard/KanbanBoard', () => () => <div data-testid="kanban-board">Kanban Board</div>);

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, onChange, value, ...props }) => (
    <input
      data-testid="date-picker"
      placeholder={label}
      onChange={(e) => onChange(e.target.value)}
      value={value ? value.format('YYYY-MM-DD') : ''} // This might need adjustment if value is not always a dayjs object
      {...props}
    />
  ),
}));
jest.mock('@mui/x-date-pickers/AdapterDayjs', () => ({ AdapterDayjs: jest.fn() }));
jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({ children, ...props }) => (
  <div data-testid="localization-provider" {...props}>{children}</div>
));
jest.mock('@mui/x-date-pickers/internals/demo', () => ({
  DemoContainer: ({ children }) => <div data-testid="demo-container">{children}</div>,
}));

const mockStore = configureStore([]);

describe('KanbanBoardContainer', () => {
  let store;
  const initialState = {
    auth: {
      userData: {
        isAdmin: true,
        isTaskCreator: true,
        userId: 'testAssigneeId',
      },
    },
    ticketsData: {
      projectId: 'testProjectId',
      tickets: [],
      isPending: false,
      isError: false,
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn().mockReturnValue(Promise.resolve());
  });

  it('renders KanbanBoard and "Add Task" button for authorized users', () => {
    render(
      <Provider store={store}>
        <KanbanBoardContainer />
      </Provider>
    );
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('does not render "Add Task" button for unauthorized users', () => {
    const unauthorizedState = {
      ...initialState,
      auth: {
        userData: {
          isAdmin: false,
          isTaskCreator: false,
          userId: 'testUser',
        },
      },
    };
    store = mockStore(unauthorizedState);
    render(
      <Provider store={store}>
        <KanbanBoardContainer />
      </Provider>
    );
    expect(screen.queryByRole('button', { name: /add task/i })).not.toBeInTheDocument();
  });

  it('opens and closes the add task modal', async () => {
    render(
      <Provider store={store}>
        <KanbanBoardContainer />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByRole('heading', { name: /create task/i })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('close'));
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /create task/i })).not.toBeInTheDocument();
    });
  });

  it('dispatches addTask and getTickets on submit and closes modal', async () => {
    render(
      <Provider store={store}>
        <KanbanBoardContainer />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    fireEvent.change(screen.getByLabelText(/task description/i), { target: { value: 'New Test Task' } });
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: '2025-07-30' } }); // Mocking date input

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        addTask({
          taskData: {
            description: 'New Test Task',
            dueDate: '2025-07-30',
            projectId: 'testProjectId',
            assigneeId: 'testAssigneeId',
          },
        })
      );
      expect(store.dispatch).toHaveBeenCalledWith(getTickets({ projectId: 'testProjectId' }));
      expect(screen.queryByRole('heading', { name: /create task/i })).not.toBeInTheDocument();
    });
  });

  it('resets form data after successful submission', async () => {
    render(
      <Provider store={store}>
        <KanbanBoardContainer />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    const descriptionInput = screen.getByLabelText(/task description/i);
    const dueDateInput = screen.getByLabelText(/due date/i);

    fireEvent.change(descriptionInput, { target: { value: 'Task to be reset' } });
    fireEvent.change(dueDateInput, { target: { value: '2025-08-15' } });

    expect(descriptionInput.value).toBe('Task to be reset');
    expect(dueDateInput.value).toBe('2025-08-15');

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(descriptionInput.value).toBe('');
      expect(dueDateInput.value).toBe('');
    });
  });
});