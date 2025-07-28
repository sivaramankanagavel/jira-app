import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import Projects from '../Projects/Projects';
import { addProject } from '../../redux-store/slice/project-slice';
import { getTickets } from '../../redux-store/slice/tasks-slice';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockStore = configureStore([]);

describe('Projects Page', () => {
  let store;
  const initialState = {
    auth: {
      userData: {
        isAdmin: false,
        userId: 'user123',
      },
    },
    projectsData: {
      projects: [
        { _id: 'proj1', name: 'Project Alpha', description: 'Desc A', startDate: '2024-01-01', endDate: '2024-12-31' },
        { _id: 'proj2', name: 'Project Beta', description: 'Desc B', startDate: '2024-02-01', endDate: '2024-11-30' },
      ],
      isPending: false,
      isError: false,
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn().mockReturnValue(Promise.resolve());
    mockNavigate.mockClear();
  });

  it('renders project list correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Projects />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.queryByLabelText('add-project')).not.toBeInTheDocument();
  });

  it('shows "Add Project" button for admin users', () => {
    const adminState = {
      ...initialState,
      auth: {
        userData: {
          isAdmin: true,
          userId: 'admin123',
        },
      },
    };
    store = mockStore(adminState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Projects />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByLabelText('add-project')).toBeInTheDocument();
  });

  it('opens and closes the add project modal', async () => {
    const adminState = {
      ...initialState,
      auth: {
        userData: {
          isAdmin: true,
          userId: 'admin123',
        },
      },
    };
    store = mockStore(adminState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Projects />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByLabelText('add-project'));
    expect(screen.getByRole('heading', { name: /create project/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /create project/i })).not.toBeInTheDocument();
    });
  });

  it('dispatches addProject and closes modal on submit', async () => {
    const adminState = {
      ...initialState,
      auth: {
        userData: {
          isAdmin: true,
          userId: 'admin123',
        },
      },
    };
    store = mockStore(adminState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Projects />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByLabelText('add-project'));

    fireEvent.change(screen.getByLabelText(/project name/i), { target: { value: 'New Test Project' } });
    fireEvent.change(screen.getByLabelText(/project description/i), { target: { value: 'A test description' } });
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2025-03-31' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        addProject({
          projectData: {
            name: 'New Test Project',
            description: 'A test description',
            startDate: '2025-01-01',
            endDate: '2025-03-31',
          },
        })
      );
      expect(screen.queryByRole('heading', { name: /create project/i })).not.toBeInTheDocument();
    });
  });

  it('dispatches getTickets and navigates on project card click', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Projects />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Project Alpha'));

    expect(store.dispatch).toHaveBeenCalledWith(getTickets({ projectId: 'proj1' }));
    expect(mockNavigate).toHaveBeenCalledWith('/projects/proj1');
  });
});
