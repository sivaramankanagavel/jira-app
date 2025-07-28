import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import getTicketsBasedOnProject, { getTickets, updateTaskStatus, addTask } from '../tasks-slice';

jest.mock('axios');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('tasks-slice', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
    localStorage.clear();
    process.env.REACT_APP_API_BASE_URL = 'http://test-api.com';
    process.env.REACT_APP_API_TASKS_AND_PROJECTS = '/tasks/projects';
    process.env.REACT_APP_API_TASKS = '/tasks';
  });

  describe('getTickets', () => {
    it('dispatches fulfilled with tickets on successful fetch', async () => {
      const mockTickets = [{ _id: '1', description: 'Task 1' }];
      const projectId = 'project123';
      axios.get.mockResolvedValueOnce({ data: mockTickets });
      localStorage.setItem('jwt', 'mockJwt');

      await store.dispatch(getTickets({ projectId }));

      const actions = store.getActions();
      expect(actions[0].type).toEqual('get the task based on userId and ProjectId/pending');
      expect(actions[1].type).toEqual('get the task based on userId and ProjectId/fulfilled');
      expect(actions[1].payload).toEqual(mockTickets);
      expect(actions[1].meta.arg.projectId).toEqual(projectId);
      expect(axios.get).toHaveBeenCalledWith(
        `http://test-api.com/tasks/projects/${projectId}`,
        { headers: { Authorization: 'Bearer mockJwt' } }
      );
    });

    it('dispatches rejected on fetch failure', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      localStorage.setItem('jwt', 'mockJwt');

      await store.dispatch(getTickets({ projectId: 'project123' }));

      const actions = store.getActions();
      expect(actions[0].type).toEqual('get the task based on userId and ProjectId/pending');
      expect(actions[1].type).toEqual('get the task based on userId and ProjectId/rejected');
      expect(actions[1].payload).toEqual(expect.any(Error));
    });
  });

  describe('updateTaskStatus', () => {
    it('dispatches fulfilled on successful update', async () => {
      const taskId = 'task123';
      const updatedData = { status: 'COMPLETED' };
      axios.put.mockResolvedValueOnce({ data: { message: 'Task updated' } });
      localStorage.setItem('jwt', 'mockJwt');

      await store.dispatch(updateTaskStatus({ taskId, updatedData }));

      const actions = store.getActions();
      expect(actions[0].type).toEqual('Update Task Status/pending');
      expect(actions[1].type).toEqual('Update Task Status/fulfilled');
      expect(actions[1].payload).toEqual({ message: 'Task updated' });
      expect(axios.put).toHaveBeenCalledWith(
        `http://test-api.com/tasks/${taskId}`,
        updatedData,
        { headers: { Authorization: 'Bearer mockJwt' } }
      );
    });

    it('dispatches rejected on update failure', async () => {
      const errorMessage = 'Update Error';
      axios.put.mockRejectedValueOnce(new Error(errorMessage));
      localStorage.setItem('jwt', 'mockJwt');

      await store.dispatch(updateTaskStatus({ taskId: 'task123', updatedData: {} }));

      const actions = store.getActions();
      expect(actions[0].type).toEqual('Update Task Status/pending');
      expect(actions[1].type).toEqual('Update Task Status/rejected');
      expect(actions[1].payload).toEqual(expect.any(Error));
    });
  });

  describe('addTask', () => {
    it('dispatches fulfilled on successful add task', async () => {
      const taskData = { description: 'New Task', projectId: 'proj1' };
      axios.post.mockResolvedValueOnce({ data: { message: 'Task added' } });
      localStorage.setItem('jwt', 'mockJwt');

      await store.dispatch(addTask({ taskData }));

      const actions = store.getActions();
      expect(actions[0].type).toEqual('Create Task/pending');
      expect(actions[1].type).toEqual('Create Task/fulfilled');
      expect(actions[1].payload).toEqual({ message: 'Task added' });
      expect(axios.post).toHaveBeenCalledWith(
        'http://test-api.com/tasks',
        taskData,
        { headers: { Authorization: 'Bearer mockJwt' } }
      );
    });

    it('dispatches rejected on add task failure', async () => {
      const errorMessage = 'Add Task Error';
      axios.post.mockRejectedValueOnce(new Error(errorMessage));
      localStorage.setItem('jwt', 'mockJwt');

      await store.dispatch(addTask({ taskData: {} }));

      const actions = store.getActions();
      expect(actions[0].type).toEqual('Create Task/pending');
      expect(actions[1].type).toEqual('Create Task/rejected');
      expect(actions[1].payload).toEqual(expect.any(Error));
    });
  });

  describe('getTicketsBasedOnProject reducer', () => {
    it('should handle getTickets.pending', () => {
      const initialState = { tickets: [], isError: false, isPending: false, projectId: null };
      const action = { type: getTickets.pending.type };
      const state = getTicketsBasedOnProject.reducer(initialState, action);
      expect(state.isPending).toBe(true);
      expect(state.isError).toBe(false);
    });

    it('should handle getTickets.fulfilled', () => {
      const initialState = { tickets: [], isError: false, isPending: true, projectId: null };
      const mockPayload = [{ _id: '1', description: 'Test' }];
      const mockProjectId = 'testProj';
      const action = {
        type: getTickets.fulfilled.type,
        payload: mockPayload,
        meta: { arg: { projectId: mockProjectId } },
      };
      const state = getTicketsBasedOnProject.reducer(initialState, action);
      expect(state.tickets).toEqual(mockPayload);
      expect(state.projectId).toEqual(mockProjectId);
      expect(state.isPending).toBe(false);
      expect(state.isError).toBe(false);
    });

    it('should handle getTickets.rejected', () => {
      const initialState = { tickets: [], isError: false, isPending: true, projectId: null };
      const action = { type: getTickets.rejected.type };
      const state = getTicketsBasedOnProject.reducer(initialState, action);
      expect(state.isError).toBe(true);
      expect(state.isPending).toBe(true);
    });
  });
});
