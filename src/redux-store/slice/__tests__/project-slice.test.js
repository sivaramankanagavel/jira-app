import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import { fetchProjects, addProject } from '../project-slice';

jest.mock('axios');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('project-slice', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
    localStorage.clear();
    process.env.REACT_APP_API_BASE_URL = 'http://test-api.com';
    process.env.REACT_APP_PROJECTS_ENDPOINT = '/projects';
  });

  describe('fetchProjects', () => {
    it('dispatches fulfilled with projects on successful fetch', async () => {
      const mockProjects = [{ id: 1, name: 'Project A' }];
      axios.get.mockResolvedValueOnce({ data: mockProjects });
      localStorage.setItem('jwt', 'mockJwt');

      await store.dispatch(fetchProjects());

      const actions = store.getActions();
      expect(actions[0].type).toEqual('projects/fetchProjects/pending');
      expect(actions[1].type).toEqual('projects/fetchProjects/fulfilled');
      expect(actions[1].payload).toEqual(mockProjects);
      expect(axios.get).toHaveBeenCalledWith(
        'http://test-api.com/projects',
        { headers: { Authorization: 'Bearer mockJwt' } }
      );
    });

    it('dispatches rejected on fetch failure', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      localStorage.setItem('jwt', 'mockJwt');

      await store.dispatch(fetchProjects());

      const actions = store.getActions();
      expect(actions[0].type).toEqual('projects/fetchProjects/pending');
      expect(actions[1].type).toEqual('projects/fetchProjects/rejected');
      expect(actions[1].payload).toEqual(errorMessage);
    });
  });

  describe('addProject', () => {
    it('dispatches fulfilled and refetches projects on successful add', async () => {
      const mockProjectData = { name: 'New Project' };
      axios.post.mockResolvedValueOnce({ data: { message: 'Project added' } });
      axios.get.mockResolvedValueOnce({ data: [] });
      localStorage.setItem('jwt', 'mockJwt');

      await store.dispatch(addProject({ projectData: mockProjectData }));

      const actions = store.getActions();
      expect(actions[0].type).toEqual('projects/addProject/pending');
      expect(axios.post).toHaveBeenCalledWith(
        'http://test-api.com/projects',
        mockProjectData,
        { headers: { Authorization: 'Bearer mockJwt' } }
      );
      expect(actions[1].type).toEqual('projects/fetchProjects/pending');
      expect(actions[2].type).toEqual('projects/fetchProjects/fulfilled');
      expect(actions[3].type).toEqual('projects/addProject/fulfilled');
    });

    it('dispatches rejected on add project failure', async () => {
      const errorMessage = 'Validation Error';
      axios.post.mockRejectedValueOnce(new Error(errorMessage));
      localStorage.setItem('jwt', 'mockJwt');

      await store.dispatch(addProject({ projectData: { name: 'New Project' } }));

      const actions = store.getActions();
      expect(actions[0].type).toEqual('projects/addProject/pending');
      expect(actions[1].type).toEqual('projects/addProject/rejected');
      expect(actions[1].payload).toEqual(errorMessage);
    });
  });
});
