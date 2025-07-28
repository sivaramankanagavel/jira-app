import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Admin from '../Admin/Admin';
import { setAdminData } from '../../redux-store/slice/auth-slice';

const mockStore = configureStore([]);

describe('Admin Page', () => {
  let store;
  const initialState = {
    admin: {
      email: '',
      userType: '',
      project: '',
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  it('renders admin form elements', () => {
    render(
      <Provider store={store}>
        <Admin />
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /add user in current project/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/user type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('updates form fields on change', () => {
    render(
      <Provider store={store}>
        <Admin />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { name: 'email', value: 'newuser@example.com' } });
    expect(emailInput.value).toBe('newuser@example.com');

    const userTypeSelect = screen.getByLabelText(/user type/i);
    fireEvent.change(userTypeSelect, { target: { name: 'userType', value: 'admin' } });
    expect(userTypeSelect.value).toBe('admin');

    const projectSelect = screen.getByLabelText(/project/i);
    fireEvent.change(projectSelect, { target: { name: 'project', value: 'Comcast Project' } });
    expect(projectSelect.value).toBe('Comcast Project');
  });

  it('dispatches setAdminData on submit and resets form', () => {
    render(
      <Provider store={store}>
        <Admin />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: 'submit@example.com' } });
    fireEvent.change(screen.getByLabelText(/user type/i), { target: { name: 'userType', value: 'user' } });
    fireEvent.change(screen.getByLabelText(/project/i), { target: { name: 'project', value: 'Jira Project' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(store.dispatch).toHaveBeenCalledWith(
      setAdminData({
        email: 'submit@example.com',
        userType: 'user',
        project: 'Jira Project',
      })
    );
    expect(screen.getByLabelText(/email/i).value).toBe('');
    expect(screen.getByLabelText(/user type/i).value).toBe('user');
    expect(screen.getByLabelText(/project/i).value).toBe('Jira Project');
  });

  it('resets form on cancel button click', () => {
    render(
      <Provider store={store}>
        <Admin />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: 'temp@example.com' } });
    fireEvent.change(screen.getByLabelText(/user type/i), { target: { name: 'userType', value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/project/i), { target: { name: 'project', value: 'Comcast Project' } });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.getByLabelText(/email/i).value).toBe('');
    expect(screen.getByLabelText(/user type/i).value).toBe('user');
    expect(screen.getByLabelText(/project/i).value).toBe('Jira Project');
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
