import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import App from '../App';

jest.mock('../Pages/Home/Home', () => () => <div data-testid="home-page">Home Page</div>);
jest.mock('../Pages/Login/Login', () => () => <div data-testid="login-page">Login Page</div>);
jest.mock('../Pages/Projects/Projects', () => () => <div data-testid="projects-page">Projects Page</div>);
jest.mock('../Pages/Admin/Admin', () => () => <div data-testid="admin-page">Admin Page</div>);
jest.mock('../components/KanbanBoard-Container/KanbanBoardContainer', () => () => <div data-testid="kanban-board-container">Kanban Board Container</div>);
jest.mock('../Pages/IndividualProject/IndividualProject', () => () => <div data-testid="individual-project-page">Individual Project Page</div>);
jest.mock('../components/ProtectedRoute/ProtectedRoute', () => ({ children }) => <div data-testid="protected-route-wrapper">{children}</div>);

const mockStore = configureStore([]);

describe('App Routing', () => {
  let store;
  const initialState = {
    auth: {
      isLoggedIn: true,
      user: { displayName: 'Test User' },
      userData: {
        isAdmin: true,
        userId: 'testUserId',
      },
    },
    sidenav: {
      isOpen: false,
    },
    ticketsData: {
      projectId: 'mockProjectId',
      tickets: [],
      isPending: false,
      isError: false,
    },
    projectsData: {
      projects: [],
      isPending: false,
      isError: false,
    },
    admin: {
      email: '',
      userType: '',
      project: '',
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders Home component for the root path', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders Login component for /login path', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders Projects component for /projects path', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/projects']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('projects-page')).toBeInTheDocument();
  });

  it('renders Admin component for /admin path', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('admin-page')).toBeInTheDocument();
  });

  it('renders KanbanBoardContainer for /board path', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/board']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('kanban-board-container')).toBeInTheDocument();
  });

  it('renders IndividualProject for /projects/:projectId path', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/projects/someProjectId']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('individual-project-page')).toBeInTheDocument();
  });

  it('ProtectedRoute is used for protected routes', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/projects']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('protected-route-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('projects-page')).toBeInTheDocument();
  });
});
