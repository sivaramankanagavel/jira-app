import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import MainPanel from '../Main-Panel/MainPanel';
import { toggleSidenav } from '../../redux-store/slice/sidenav-slice';

// Mock child components to prevent deep rendering
jest.mock('../BreadCrumbs/BreadCrumbs', () => () => <div data-testid="breadcrumbs">BreadCrumbs</div>);
jest.mock('../Main-Panel-Container/MainPanelContainer', () => ({ children }) => <div data-testid="main-panel-container">{children}</div>);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet-content">Outlet Content</div>,
}));


const mockStore = configureStore([]);

describe('MainPanel', () => {
  let store;
  const initialState = {
    sidenav: {
      isOpen: false,
    },
    auth: {
      isLoggedIn: true,
      userData: {
        userId: 'testUserId',
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn(); // Mock dispatch
  });

  it('renders BreadCrumbs and MainPanelContainer', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPanel />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('main-panel-container')).toBeInTheDocument();
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });

  it('shows menu icon when sidenav is closed, logged in, and userId exists', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPanel />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByLabelText('menu')).toBeInTheDocument();
  });

  it('hides menu icon when sidenav is open', () => {
    const openSidenavState = {
      ...initialState,
      sidenav: { isOpen: true },
    };
    store = mockStore(openSidenavState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPanel />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByLabelText('menu')).not.toBeInTheDocument();
  });

  it('hides menu icon when not logged in', () => {
    const loggedOutState = {
      ...initialState,
      auth: { isLoggedIn: false, userData: { userId: null } },
    };
    store = mockStore(loggedOutState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPanel />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByLabelText('menu')).not.toBeInTheDocument();
  });

  it('dispatches toggleSidenav when menu icon is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPanel />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(screen.getByLabelText('menu'));
    expect(store.dispatch).toHaveBeenCalledWith(toggleSidenav());
  });

  it('applies "shifted" class when sidenav is open', () => {
    const openSidenavState = {
      ...initialState,
      sidenav: { isOpen: true },
    };
    store = mockStore(openSidenavState);
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPanel />
        </MemoryRouter>
      </Provider>
    );
    expect(container.querySelector('.main-panel')).toHaveClass('shifted');
  });

  it('does not apply "shifted" class when sidenav is closed', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPanel />
        </MemoryRouter>
      </Provider>
    );
    expect(container.querySelector('.main-panel')).not.toHaveClass('shifted');
  });
});
