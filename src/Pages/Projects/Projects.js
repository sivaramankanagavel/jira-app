import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  TextField,
  IconButton,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { addProject } from "../../redux-store/slice/add-project-slice";
import { getTickets } from "../../redux-store/slice/tasks-slice";
import { useNavigate } from "react-router-dom";

import "./styles.scss";

function Projects() {
  const [showProjectModel, setShowProjectModel] = useState(false);
  const [projectCreationData, setprojectCreationData] = useState({
    projectName: "",
    projectDescription: "",
    ownerId: "",
    startDate: "",
    endDate: "",
    createdAt: "",
  });
  const dispatch = useDispatch();
  const naviagte = useNavigate()
  const userData = useSelector((state) => state?.loginEndpoint?.userData);
  const projectsDataFromStore =
    useSelector((state) => state?.projectsData?.projects) || [];
  const isAdmin = useSelector((state) => state?.loginEndpoint?.isAdmin);

  const handleProjectAdd = () => {
    setShowProjectModel(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setprojectCreationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProject(projectCreationData));
    setShowProjectModel(false);
  };

  // Handle card click to navigate to tasks page
  const handleCardClick = (projectId) => {
    dispatch(getTickets({projectId: projectId, userId: userData.userId}));
    naviagte(`/projects/${projectId}`);
  };

  return (
    <div className="d-flex flex-wrap row-12 w-100 h-100 p-0 m-0 justify-content-center ">
      {isAdmin && (
        <div>
          <Button
            variant="contained"
            className="w-100 row-1 mb-2"
            startIcon={<AddIcon />}
            onClick={handleProjectAdd}
            disabled={!isAdmin}
          >
            Add Project
          </Button>
        </div>
      )}
      {projectsDataFromStore?.length > 0 ? (
        <div className="row w-100 p-0 m-0">
          {projectsDataFromStore?.map((project) => (
            <div
              key={project.id}
              className="col-3 col-md-6 col-lg-4 mb-3 pt-3 h-50"
              style={{ cursor: "pointer" }}
              onClick={() => handleCardClick(project.id)}
            >
              <Card variant="outlined" sx={{ "&:hover": { boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mt={1}
                  >
                    Owner: {project.ownerId}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Start: {project.startDate} | End: {project.endDate}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Typography variant="h6" color="text.secondary" className="mt-4">
          No Projects assigned
        </Typography>
      )}
      <Modal
        open={showProjectModel}
        onClose={() => setShowProjectModel(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className="d-flex row-8 justify-content-center align-items-center overflow-auto"
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            zIndex: 1000,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 24,
            overflowY: "auto",
            position: "relative",
          }}
          className="container w-50 h-75"
        >
          <IconButton
            onClick={() => setShowProjectModel(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1100,
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <h2 id="parent-modal-title" className="text-center row-8">
            Add Project
          </h2>
          <div className="row-8 g-3">
            <div className="col-8 m-0 mb-3 w-100">
              <FormControl className="w-100">
                <FormLabel htmlFor="project-name">Project Name</FormLabel>
                <TextField
                  name="projectName"
                  id="project-name"
                  type="text"
                  placeholder="Enter Your Project Name.."
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  value={projectCreationData.projectName}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
            <div className="col-8 m-0 mb-3 w-100">
              <FormControl className="w-100">
                <FormLabel htmlFor="project-descr">
                  Project Description
                </FormLabel>
                <TextField
                  name="projectDescription"
                  id="project-descr"
                  type="text"
                  placeholder="Enter Your Project Description.."
                  required
                  fullWidth
                  variant="outlined"
                  value={projectCreationData.projectDescription}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
            <div className="col-8 m-0 w-100 mb-3">
              <FormControl className="w-100">
                <FormLabel htmlFor="owner-id">Owner ID</FormLabel>
                <TextField
                  name="ownerId"
                  id="owner-id"
                  type="text"
                  placeholder="Enter Your Owner ID.."
                  required
                  fullWidth
                  variant="outlined"
                  value={projectCreationData.ownerId}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
            <div className="col-8 m-0 mb-3 w-100">
              <FormControl className="w-100">
                <FormLabel htmlFor="start-date">Start Date</FormLabel>
                <TextField
                  name="startDate"
                  id="start-date"
                  type="date"
                  placeholder="Enter Your Start Date.."
                  required
                  fullWidth
                  variant="outlined"
                  value={projectCreationData.startDate}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
            <div className="col-8 m-0 mb-3 w-100">
              <FormControl className="w-100">
                <FormLabel htmlFor="end-date">End Date</FormLabel>
                <TextField
                  name="endDate"
                  id="end-date"
                  type="date"
                  placeholder="Enter Your End Date.."
                  required
                  fullWidth
                  variant="outlined"
                  value={projectCreationData.endDate}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
            <div className="col-8 m-0 mb-3 w-100">
              <FormControl className="w-100">
                <FormLabel htmlFor="create-at">Created At</FormLabel>
                <TextField
                  name="createdAt"
                  id="create-at"
                  type="date"
                  placeholder="Enter Your Created At.."
                  required
                  fullWidth
                  variant="outlined"
                  value={projectCreationData.createdAt}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
          </div>
          <div className="row g-3 p-0 align-item-center justify-content-center mb-3">
            <div className="d-flex col-6 align-item-center justify-content-center">
              <Button
                variant="contained"
                onClick={() => setShowProjectModel(false)}
              >
                Cancel
              </Button>
            </div>
            <div className="d-flex col-6 align-item-center justify-content-center">
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Projects;
