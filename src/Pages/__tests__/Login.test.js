import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login/Login';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import * as authActions from '../../redux-store/slice/auth-slice';
import * as projectActions from '../../redux-store/slice/project-slice';

const mockThunkMiddleware = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  return next(action);
};

const middlewares = [mockThunkMiddleware];
const mockStore = configureMockStore(middlewares);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../redux-store/slice/auth-slice', () => {
  const mockLoginEndPointAsyncFunc = jest.fn(({ idToken }) => {
    return async (dispatch) => {
      dispatch({ type: 'auth/loginEndPoint/pending' });
      try {
        const userDataPayload = {
          readonly: false,
          isAdmin: true,
          userId: 'user-123',
          isTaskCreator: false,
          expiration: Date.now() + 3600000,
          jwt: 'mock-jwt-token',
        };
        dispatch({ type: 'auth/loginEndPoint/fulfilled', payload: userDataPayload });
        return userDataPayload;
      } catch (error) {
        dispatch({ type: 'auth/loginEndPoint/rejected', payload: error.message || 'Backend login failed' });
        throw error;
      }
    };
  });

  const mockLoginWithGoogle = jest.fn(() => {
    return async (dispatch) => {
      dispatch({ type: 'auth/loginWithGoogle/pending' });

      const mockUser = {
        uid: 'mock-uid',
        displayName: 'Mock User',
        email: 'mock@example.com',
        photoURL: 'mock-photo.jpg',
        providerId: 'google.com',
        accessToken: 'mock-firebase-id-token',
      };

      try {
        await dispatch(
          mockLoginEndPointAsyncFunc({ idToken: mockUser.accessToken })
        );

        dispatch({
          type: 'auth/loginWithGoogle/fulfilled',
          payload: {
            uid: mockUser.uid,
            displayName: mockUser.displayName,
            email: mockUser.email,
            photoURL: mockUser.photoURL,
            providerId: mockUser.providerId,
            idToken: mockUser.accessToken,
          },
        });
        return {
          uid: mockUser.uid,
          displayName: mockUser.displayName,
          email: mockUser.email,
          photoURL: mockUser.photoURL,
          providerId: mockUser.providerId,
          idToken: mockUser.accessToken,
        };
      } catch (error) {
        dispatch({
          type: 'auth/loginWithGoogle/rejected',
          payload: error.message || 'Google login failed',
        });
        throw error;
      }
    };
  });

  return {
    ...jest.requireActual('../../redux-store/slice/auth-slice'),
    loginWithGoogle: mockLoginWithGoogle,
    loginEndPointAsyncFunc: mockLoginEndPointAsyncFunc,
  };
});

jest.mock('../../redux-store/slice/project-slice', () => ({
  ...jest.requireActual('../../redux-store/slice/project-slice'),
  fetchProjects: jest.fn((userId) => {
    return async (dispatch) => {
      dispatch({ type: 'project/fetchProjects/pending' });
      try {
        dispatch({ type: 'project/fetchProjects/fulfilled', payload: [] });
        return [];
      } catch (error) {
        dispatch({ type: 'project/fetchProjects/rejected', payload: error.message || 'Failed to fetch projects' });
        throw error;
      }
    };
  }),
}));

describe('Login Page', () => {
  let store;

  const renderComponent = (state) => {
    store = mockStore(state);
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
  };

  const initialState = {
    auth: {
      isLoggedIn: false,
      user: {
        uid: null,
        displayName: null,
        email: null,
        photoURL: null,
        providerId: null,
        idToken: 'initial-mock-id-token',
      },
      loginError: null,
      userData: {
        readonly: null,
        isAdmin: null,
        userId: null,
        isTaskCreator: null,
        expiration: null,
        jwt: null,
      },
      endpointIsError: false,
      endpointIsPending: false,
    },
    projects: {
      projects: [],
      error: null,
      loading: false,
    },
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('renders Login component', () => {
    renderComponent(initialState);
    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
  });

  it('dispatches loginWithGoogle on Google sign-in click', async () => {
    renderComponent(initialState);
    const googleBtn = screen.getByText(/Sign in with Google/i);
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(authActions.loginWithGoogle).toHaveBeenCalled();

      const dispatchedActions = store.getActions();
      expect(dispatchedActions).toEqual([
        { type: 'auth/loginWithGoogle/pending' },
        { type: 'auth/loginEndPoint/pending' },
        {
          type: 'auth/loginEndPoint/fulfilled',
          payload: {
            readonly: false,
            isAdmin: true,
            userId: 'user-123',
            isTaskCreator: false,
            expiration: expect.any(Number),
            jwt: 'mock-jwt-token',
          },
        },
        {
          type: 'auth/loginWithGoogle/fulfilled',
          payload: {
            uid: 'mock-uid',
            displayName: 'Mock User',
            email: 'mock@example.com',
            photoURL: 'mock-photo.jpg',
            providerId: 'google.com',
            idToken: 'mock-firebase-id-token',
          },
        },
      ]);
    });
  });

  it('dispatches loginEndPointAsyncFunc when isLoggedIn is true and userData.userId is null', async () => {
    const updatedState = {
      auth: {
        ...initialState.auth,
        isLoggedIn: true,
        user: { ...initialState.auth.user, idToken: 'mock-id-token-from-user-state' },
        userData: { ...initialState.auth.userData, userId: null },
      },
    };
    renderComponent(updatedState);

    await waitFor(() => {
      expect(authActions.loginEndPointAsyncFunc).toHaveBeenCalledWith({ idToken: 'mock-id-token-from-user-state' });
      const dispatchedActions = store.getActions();
      expect(dispatchedActions).toEqual([
        { type: 'auth/loginEndPoint/pending' },
        {
          type: 'auth/loginEndPoint/fulfilled',
          payload: {
            readonly: false,
            isAdmin: true,
            userId: 'user-123',
            isTaskCreator: false,
            expiration: expect.any(Number),
            jwt: 'mock-jwt-token',
          },
        },
      ]);
    });
  });

  it('navigates to "/" and fetches projects when logged in and backend login is successful', async () => {
    const updatedState = {
      auth: {
        ...initialState.auth,
        isLoggedIn: true,
        userData: { ...initialState.auth.userData, userId: 'user-123' },
      },
    };
    renderComponent(updatedState);
    await waitFor(() => {
          expect(projectActions.fetchProjects).toHaveBeenCalledWith('user-123');
          expect(mockNavigate).toHaveBeenCalledWith('/');
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toContainEqual({ type: 'project/fetchProjects/pending' });
          expect(dispatchedActions).toContainEqual({ type: 'project/fetchProjects/fulfilled', payload: [] });
    });
  });

  it('shows Snackbar when endpoint login fails', async () => {
    const originalLoginEndPointAsyncFunc = authActions.loginEndPointAsyncFunc;
    authActions.loginEndPointAsyncFunc.mockImplementationOnce(({ idToken }) => {
      return async (dispatch) => {
        dispatch({ type: 'auth/loginEndPoint/pending' });
        const errorMsg = 'User was Not Registerd for this JIRA Account. Please contact your Admin.';
        dispatch({ type: 'auth/loginEndPoint/rejected', payload: errorMsg });
        throw new Error(errorMsg);
      };
    });

    const errorState = {
      auth: {
        ...initialState.auth,
        isLoggedIn: true,
        user: { ...initialState.auth.user, idToken: 'mock-id-token-for-failure' },
        userData: { ...initialState.auth.userData, userId: null },
        endpointIsError: false,
        endpointIsPending: false,
        loginError: null,
      },
    };
    renderComponent(errorState);

    await waitFor(() => {
      expect(authActions.loginEndPointAsyncFunc).toHaveBeenCalledWith({ idToken: 'mock-id-token-for-failure' });
    });

    expect(await screen.findByText(/User was Not Registerd for this JIRA Account. Please contact your Admin./i)).toBeInTheDocument();

    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toContainEqual({ type: 'auth/loginEndPoint/pending' });
    expect(dispatchedActions).toContainEqual({
      type: 'auth/loginEndPoint/rejected',
      payload: 'User was Not Registerd for this JIRA Account. Please contact your Admin.',
    });

    authActions.loginEndPointAsyncFunc = originalLoginEndPointAsyncFunc;
  });

  it('closes Snackbar when Alert is clicked', async () => {
    const errorState = {
      auth: {
        ...initialState.auth,
        isLoggedIn: false,
        userData: { ...initialState.auth.userData, userId: null },
        endpointIsError: true,
        loginError: "Test Login Error",
      },
    };
    renderComponent(errorState);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});