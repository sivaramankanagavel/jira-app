import { useState } from "react";
import KanbanBoard from "../KanbanBoard/KanbanBoard";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addTask, getTickets } from "../../redux-store/slice/tasks-slice";

import "./styles.scss";

const KanbanBoardContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskCreationData, setTaskCreationData] = useState({
    description: "",
    dueDate: null,
    assigneeId: null
  });
  const userData = useSelector((state) => state?.loginEndpoint?.userData);
  const projectId = useSelector((state) => state?.ticketsData?.projectId);
  const dispatch = useDispatch();

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskCreationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle date change for DatePicker
  const handleDateChange = (newValue) => {
    setTaskCreationData((prevData) => ({
      ...prevData,
      dueDate: newValue,
    }));
  };

  // Handle form submission for task creation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskCreationData.description && taskCreationData.dueDate) {
      const taskData = {
        ...taskCreationData,
        projectId: projectId,
        ownerId: userData?.userId,
        assigneeId: userData?.userId
      };
      dispatch(addTask({ taskData: taskData })).then(() => {
        dispatch(getTickets({ projectId, userId: userData?.userId }));
        setIsOpen(false);
        setTaskCreationData({
          description: "",
          dueDate: null,
          projectId: null,
          ownerId: null,
          assigneeId: null
        });
      });
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100 gap-3 p-1">
      {userData?.isAdmin || userData?.isTaskCreator ? (
        <div className="d-flex justify-content-end align-items-center w-100">
          <Button
            variant="contained"
            color="primary"
            aria-label="add-task"
            startIcon={<AddIcon />}
            onClick={handleIsOpen}
          >
            Add Task
          </Button>
        </div>
      ) : null}
      <KanbanBoard />
      <Modal
        open={isOpen}
        onClose={handleIsOpen}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className="d-flex row-8 justify-content-center align-items-center overflow-auto"
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            zIndex: 2000,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 24,
            overflowY: "auto",
            position: "relative",
          }}
          className="container w-25 h-75"
        >
          <IconButton
            onClick={handleIsOpen}
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
            Add Task
          </h2>
          <div className="row-8 g-3">
            <div className="col-8 m-0 mb-3 w-100">
              <FormControl className="w-100">
                <FormLabel htmlFor="taskDescription">Description</FormLabel>
                <TextField
                  name="description"
                  id="taskDescription"
                  type="text"
                  placeholder="Enter Your Task Description.."
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  value={taskCreationData.description}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
            <div className="col-8 m-0 mb-3 w-100">
              <FormControl className="w-100">
                <FormLabel htmlFor="task-due-date">Due Date</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      disablePast
                      className="w-100"
                      label="Basic date picker"
                      name="dueDate"
                      id="task-due-date"
                      value={taskCreationData.dueDate}
                      onChange={handleDateChange}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </FormControl>
            </div>
          </div>
          <div className="row g-3 p-0 align-item-center justify-content-center mb-3">
            <div className="d-flex col-6 align-item-center justify-content-center">
              <Button
                variant="contained"
                onClick={handleIsOpen}
                sx={{ backgroundColor: "red", color: "white" }}
              >
                Cancel
              </Button>
            </div>
            <div className="d-flex col-6 align-item-center justify-content-center">
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ backgroundColor: "green", color: "white" }}
              >
                Submit
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default KanbanBoardContainer;
