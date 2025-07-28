import { configureStore } from '@reduxjs/toolkit';
import sidenavReducer, { toggleSidenav } from '../sidenav-slice';

describe('sidenav-slice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        sidenav: sidenavReducer,
      },
    });
  });

  it('should return the initial state', () => {
    expect(store.getState().sidenav.isOpen).toBe(false);
  });

  it('should toggle the sidenav open state', () => {
    store.dispatch(toggleSidenav());
    expect(store.getState().sidenav.isOpen).toBe(true);

    store.dispatch(toggleSidenav());
    expect(store.getState().sidenav.isOpen).toBe(false);
  });
});
