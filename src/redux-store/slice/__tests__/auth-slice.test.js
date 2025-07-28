import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  loginEndPointAsyncFunc,
  loginWithGoogle,
  logoutWithGoogle,
  setInitialAuthData,
} from '../auth-slice';
import { auth, signInWithPopup, provider, signOutFunc } from '../../../firebase/firebase.config';
import axios from 'axios';

jest.mock('../../../firebase/firebase.config', () => ({
  auth: {},
  signInWithPopup: jest.fn(),
  provider: {},
  signOutFunc: jest.fn(),
}));

jest.mock('axios');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('auth-slice', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
    localStorage.clear();
    process.env.REACT_APP_API_BASE_URL = 'http://test-api.com';
    process.env.REACT_APP_LOGIN_ENDPOINT = '/login';
  });

  describe('loginEndPointAsyncFunc', () => {
    it('dispatches fulfilled with user data on successful backend login', async () => {
      const mockIdToken = 'mockIdToken';
      const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MTYyMzkwMjJ9.signature';
      const mockUserData = {
        _id: 'testUserId',
        role: 'USER',
        readonly: false,
        isTaskCreator: true,
      };
      axios.post.mockResolvedValueOnce({
        data: { token: mockJwtToken, user: mockUserData },
      });

      await store.dispatch(loginEndPointAsyncFunc({ idToken: mockIdToken }));

      const actions = store.getActions();
      expect(actions[0].type).toEqual('auth/loginEndPoint/pending');
      expect(actions[1].type).toEqual('auth/loginEndPoint/fulfilled');
      expect(actions[1].payload).toEqual({
        readonly: false,
        isAdmin: false,
        userId: 'testUserId',
        isTaskCreator: true,
        expiration: expect.any(Number),
        jwt: mockJwtToken,
      });
      expect(localStorage.getItem('jwt')).toEqual(mockJwtToken);
    });

    it('dispatches fulfilled with admin role on successful backend login for admin', async () => {
      const mockIdToken = 'mockIdToken';
      const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MTYyMzkwMjJ9.signature';
      const mockUserData = {
        _id: 'testUserId',
        role: 'ADMIN',
        readonly: false,
        isTaskCreator: true,
      };
      axios.post.mockResolvedValueOnce({
        data: { token: mockJwtToken, user: mockUserData },
      });

      await store.dispatch(loginEndPointAsyncFunc({ idToken: mockIdToken }));

      const actions = store.getActions();
      expect(actions[1].payload.isAdmin).toBe(true);
    });

    it('dispatches rejected on backend login failure', async () => {
      const errorMessage = 'Network Error';
      axios.post.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(loginEndPointAsyncFunc({ idToken: 'mockIdToken' }));

      const actions = store.getActions();
      expect(actions[0].type).toEqual('auth/loginEndPoint/pending');
      expect(actions[1].type).toEqual('auth/loginEndPoint/rejected');
      expect(actions[1].payload).toEqual(errorMessage);
      expect(localStorage.getItem('jwt')).toBeNull();
    });

    it('dispatches rejected if invalid response from server', async () => {
      axios.post.mockResolvedValueOnce({ data: { token: null, user: null } });

      await store.dispatch(loginEndPointAsyncFunc({ idToken: 'mockIdToken' }));

      const actions = store.getActions();
      expect(actions[1].type).toEqual('auth/loginEndPoint/rejected');
      expect(actions[1].payload).toEqual('Invalid response from server');
    });
  });

  describe('loginWithGoogle', () => {
    it('dispatches fulfilled and calls loginEndPointAsyncFunc on successful Google login', async () => {
      const mockUser = {
        uid: 'googleUid',
        displayName: 'Test User',
        email: 'test@example.com',
        photoURL: 'photo.jpg',
        providerId: 'google.com',
        accessToken: 'googleAccessToken',
      };
      signInWithPopup.mockResolvedValueOnce({ user: mockUser });
      axios.post.mockResolvedValueOnce({
        data: {
          token: 'mockJwtToken',
          user: { _id: 'testUserId', role: 'USER' },
        },
      });

      await store.dispatch(loginWithGoogle());

      const actions = store.getActions();
      expect(actions[0].type).toEqual('auth/loginWithGoogle/pending');
      expect(signInWithPopup).toHaveBeenCalledWith(auth, provider);
      expect(actions[1].type).toEqual('auth/loginEndPoint/pending');
      expect(actions[2].type).toEqual('auth/loginEndPoint/fulfilled');
      expect(actions[3].type).toEqual('auth/loginWithGoogle/fulfilled');
      expect(actions[3].payload).toEqual({
        uid: 'googleUid',
        displayName: 'Test User',
        email: 'test@example.com',
        photoURL: 'photo.jpg',
        providerId: 'google.com',
        idToken: 'googleAccessToken',
      });
    });

    it('dispatches rejected on Google login failure', async () => {
      const errorMessage = 'Google Auth Error';
      signInWithPopup.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(loginWithGoogle());

      const actions = store.getActions();
      expect(actions[0].type).toEqual('auth/loginWithGoogle/pending');
      expect(actions[1].type).toEqual('auth/loginWithGoogle/rejected');
      expect(actions[1].payload).toEqual(errorMessage);
    });
  });

  describe('logoutWithGoogle', () => {
    it('dispatches fulfilled and clears localStorage on successful logout', async () => {
      localStorage.setItem('jwt', 'someJwt');
      signOutFunc.mockResolvedValueOnce();

      await store.dispatch(logoutWithGoogle());

      const actions = store.getActions();
      expect(actions[0].type).toEqual('auth/logoutWithGoogle/pending');
      expect(signOutFunc).toHaveBeenCalled();
      expect(actions[1].type).toEqual('auth/logoutWithGoogle/fulfilled');
      expect(localStorage.getItem('jwt')).toBeNull();
    });

    it('dispatches rejected on logout failure', async () => {
      const errorMessage = 'Logout Error';
      signOutFunc.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(logoutWithGoogle());

      const actions = store.getActions();
      expect(actions[0].type).toEqual('auth/logoutWithGoogle/pending');
      expect(actions[1].type).toEqual('auth/logoutWithGoogle/rejected');
      expect(actions[1].payload).toEqual(errorMessage);
    });
  });

  describe('setInitialAuthData', () => {
    it('sets initial authentication data correctly', () => {
      const initialState = {
        isLoggedIn: false,
        user: { uid: null, displayName: null },
        userData: { userId: null },
      };
      store = mockStore(initialState);

      const payload = {
        isLoggedIn: true,
        user: { uid: '123', displayName: 'Test User' },
        userData: { userId: 'abc', isAdmin: true },
      };
      store.dispatch(setInitialAuthData(payload));

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: 'auth/setInitialAuthData',
        payload: payload,
      });
    });
  });
});
