import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import IndividualProject from '../IndividualProject/IndividualProject';

jest.mock('../../components/KanbanBoard-Container/KanbanBoardContainer', () => () => <div data-testid="kanban-board-container">Mocked Kanban Board Container</div>);

const mockStore = configureStore([]);

describe('IndividualProject Page', () => {
  let store;
  const initialState = {
    ticketsData: {
      projectId: 'someProjectId',
      tickets: [],
      isPending: false,
      isError: false,
    },
    auth: {
      userData: {
        isAdmin: false,
        isTaskCreator: false,
        userId: 'testUser',
      }
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders KanbanBoardContainer', () => {
    render(
      <Provider store={store}>
        <IndividualProject />
      </Provider>
    );
    expect(screen.getByTestId('kanban-board-container')).toBeInTheDocument();
  });
});
