import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Home from '../Home/Home';

jest.mock('../../components/SideNav/SideNav', () => ({ signInText }) => (
  <div data-testid="mock-sidenav">Mock SideNav - {signInText}</div>
));
jest.mock('../../components/Main-Panel/MainPanel', () => ({ children }) => (
  <div data-testid="mock-mainpanel">Mock MainPanel {children}</div>
));
jest.mock('../Login/Login', () => () => <div data-testid="mock-login-page">Mock Login Page</div>);
jest.mock('../Projects/Projects', () => () => <div data-testid="mock-projects-page">Mock Projects Page</div>);
jest.mock('../Admin/Admin', () => () => <div data-testid="mock-admin-page">Mock Admin Page</div>);
jest.mock('../IndividualProject/IndividualProject', () => () => <div data-testid="mock-individual-project-page">Mock Individual Project Page</div>);
jest.mock('../../components/KanbanBoard-Container/KanbanBoardContainer', () => () => (
  <div data-testid="mock-kanban-board-container">Mock Kanban Board Container</div>
));

jest.mock('../../components/ProtectedRoute/ProtectedRoute', () => ({ children }) => (
  <div data-testid="mock-protected-route">{children}</div>
));

const mockStore = configureStore([]);

describe('Home Component', () => {
  let store;
  const initialState = {
    auth: {
      isLoggedIn: true,
      userData: {
        isAdmin: true,
        userId: 'testUserId',
      },
      user: {
        displayName: 'Test User',
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
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders SideNav and MainPanel', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('mock-sidenav')).toBeInTheDocument();
    expect(screen.getByTestId('mock-mainpanel')).toBeInTheDocument();
    expect(screen.getByText('Mock SideNav - Log In')).toBeInTheDocument();
  });

  it('renders "Welcome To Main Panel" for the root path (index route)', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    // The index route of MainPanel renders "Welcome To Main Panel" wrapped in ProtectedRoute
    expect(screen.getByText('Welcome To Main Panel')).toBeInTheDocument();
    expect(screen.getByTestId('mock-protected-route')).toBeInTheDocument();
  });

  it('renders Login component for /login path', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('mock-login-page')).toBeInTheDocument();
  });

  it('renders Projects component for /projects path', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/projects']}>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('mock-projects-page')).toBeInTheDocument();
    expect(screen.getByTestId('mock-protected-route')).toBeInTheDocument();
  });

  it('renders IndividualProject component for /projects/:projectId path', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/projects/someProjectId']}>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('mock-individual-project-page')).toBeInTheDocument();
    expect(screen.getByTestId('mock-protected-route')).toBeInTheDocument();
  });

  it('renders Admin component for /admin path', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('mock-admin-page')).toBeInTheDocument();
    expect(screen.getByTestId('mock-protected-route')).toBeInTheDocument();
  });

  it('renders KanbanBoardContainer component for /board path', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/board']}>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('mock-kanban-board-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-protected-route')).toBeInTheDocument();
  });
});
