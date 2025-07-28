import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import SideNavMenu from '../Side-Nav-Menu/SideNavMenu';t

jest.mock('../../data/side-nav-menu/side-nav-menu', () => [
  { name: 'Home', icon: 'HomeIcon', path: '/' },
  { name: 'Projects', icon: 'ProjectsIcon', path: '/projects', dropdown: true, subItems: [{ name: 'All Projects', path: '/projects' }] },
  { name: 'Board', icon: 'BoardIcon', path: '/board' },
  { name: 'Admin', icon: 'AdminIcon', path: '/admin' },
]);

const mockStore = configureStore([]);

describe('SideNavMenu', () => {
  let store;
  const initialState = {
    auth: {
      userData: {
        isAdmin: false,
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders menu items correctly for a regular user (no Admin)', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SideNavMenu />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Board')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument(); // Admin should not be visible
  });

  it('renders Admin menu item for an admin user', () => {
    const adminState = {
      auth: {
        userData: {
          isAdmin: true,
        },
      },
    };
    store = mockStore(adminState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SideNavMenu />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('toggles dropdown for Projects when clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SideNavMenu />
        </MemoryRouter>
      </Provider>
    );

    const projectsButton = screen.getByText('Projects');
    expect(screen.queryByText('All Projects')).not.toBeInTheDocument();

    fireEvent.click(projectsButton);
    expect(screen.getByText('All Projects')).toBeInTheDocument();

    fireEvent.click(projectsButton);
    expect(screen.queryByText('All Projects')).not.toBeInTheDocument();
  });

  it('navigates to the correct path on menu item click', () => {
    const mockNavigate = jest.fn();
    // This spyon is correct for mocking useNavigate
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SideNavMenu />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/');

    fireEvent.click(screen.getByText('Board'));
    expect(mockNavigate).toHaveBeenCalledWith('/board');
    // For projects, it navigates to /projects when the main "Projects" item is clicked
    fireEvent.click(screen.getByText('Projects'));
    expect(mockNavigate).toHaveBeenCalledWith('/projects');
    jest.restoreAllMocks();
  });
});