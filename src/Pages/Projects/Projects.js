import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import "./styles.scss";

function Projects() {
  const [showProjectModel, setShowProjectModel] = useState(false);
  const [projectData, setProjectData] = useState({
    projectName: "",
    projectDescription: "",
    ownerId: "",
    startDate: "",
    endDate: "",
    createdAt: "",
  });

  const handleProjectAdd = () => {
    setShowProjectModel(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowProjectModel(false);
  }

  return (
    <div className="d-flex flex-wrap row-8 w-100 h-100 p-0 m-0 justify-content-center align-items-center">
      <div>
        <Button
          variant="contained"
          className="w-100 row-1 mb-2"
          startIcon={<AddIcon />}
          onClick={handleProjectAdd}
        >
          Add Project
        </Button>
      </div>
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
                  value={projectData.projectName}
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
                  value={projectData.projectDescription}
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
                  value={projectData.ownerId}
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
                  value={projectData.startDate}
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
                  value={projectData.endDate}
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
                  value={projectData.createdAt}
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
              <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Projects;
