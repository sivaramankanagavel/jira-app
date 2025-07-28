// src/components/__tests__/SideNav.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { toggleSidenav } from '../../redux-store/slice/sidenav-slice';
import { logoutWithGoogle } from '../../redux-store/slice/auth-slice';

jest.mock('../Side-Nav-Menu/SideNavMenu', () => () => <div data-testid="sidenav-menu">SideNavMenu</div>);

const mockStore = configureStore([]);

describe('SideNav', () => {
  let store;
  const initialState = {
    auth: {
      isLoggedIn: false,
      user: null,
      userData: {
        userId: null,
        isAdmin: false,
      },
    },
    sidenav: {
      isOpen: false,
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  it('renders login button when not logged in', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SideNav signInText="Log In" />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId('sidenav-menu')).not.toBeInTheDocument();
  });

  it('renders user info and logout button when logged in', () => {
    const loggedInState = {
      ...initialState,
      auth: {
        isLoggedIn: true,
        user: { displayName: 'Test User', photoURL: 'test.jpg' },
        userData: { userId: '123' },
      },
      sidenav: {
        isOpen: true,
      },
    };
    store = mockStore(loggedInState);
    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SideNav signInText="Log In" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText('sidenav-close')).toBeInTheDocument();
    expect(screen.getByTestId('sidenav-menu')).toBeInTheDocument();
  });

  it('dispatches toggleSidenav on close button click', () => {
    const loggedInState = {
      ...initialState,
      auth: {
        isLoggedIn: true,
        user: { displayName: 'Test User', photoURL: 'test.jpg' },
        userData: { userId: '123' },
      },
      sidenav: {
        isOpen: true,
      },
    };
    store = mockStore(loggedInState);
    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SideNav signInText="Log In" />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByLabelText('sidenav-close'));
    expect(store.dispatch).toHaveBeenCalledWith(toggleSidenav());
  });

  it('dispatches logoutWithGoogle and toggleSidenav on logout button click', async () => {
    const loggedInState = {
      ...initialState,
      auth: {
        isLoggedIn: true,
        user: { displayName: 'Test User', photoURL: 'test.jpg' },
        userData: { userId: '123' },
      },
      sidenav: {
        isOpen: false,
      },
    };
    store = mockStore(loggedInState);
    store.dispatch = jest.fn().mockReturnValue(Promise.resolve()); // Mock dispatch to return a promise

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SideNav signInText="Log In" />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /log out/i }));

    // Ensure both actions are dispatched
    expect(store.dispatch).toHaveBeenCalledWith(logoutWithGoogle());
    expect(store.dispatch).toHaveBeenCalledWith(toggleSidenav());
  });

  it('applies "expanded" class when sidenav is open', () => {
    const openSidenavState = {
      ...initialState,
      sidenav: { isOpen: true },
    };
    store = mockStore(openSidenavState);
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <SideNav signInText="Log In" />
        </MemoryRouter>
      </Provider>
    );
    expect(container.querySelector('.side-nav-bar')).toHaveClass('expanded');
    expect(container.querySelector('.side-nav-bar')).not.toHaveClass('collapsed');
  });

  it('applies "collapsed" class when sidenav is closed', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <SideNav signInText="Log In" />
        </MemoryRouter>
      </Provider>
    );
    expect(container.querySelector('.side-nav-bar')).toHaveClass('collapsed');
    expect(container.querySelector('.side-nav-bar')).not.toHaveClass('expanded');
  });
});