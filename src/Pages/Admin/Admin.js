import React, { useState } from "react";

import "./styles.scss";
import {
  Button,
  FormControl,
  FormLabel,
  NativeSelect,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";

function Admin() {
  const [adminData, setAdminData] = useState({
    email: "",
    userType: "",
    project: "",
  });
  const dispatch = useDispatch();

  const handleCancel = () => {
    setAdminData({
      email: "",
      userType: "",
      project: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(setAdminData(adminData));
    setAdminData({
      email: "",
      userType: "",
      project: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="d-flex flex-wrap flex-column w-75 h-100 p-0 m-0 justify-content-center align-items-center">
      <h2 className="mb-3">Add User in Current Project</h2>
      <FormControl className="w-50 row-2 mb-3">
        <FormLabel htmlFor="email-id">Email ID</FormLabel>
        <TextField
          name="email"
          id="email-id"
          type="email"
          placeholder="Enter Your Email.."
          autoFocus
          required
          fullWidth
          variant="outlined"
          value={adminData.email}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl className="w-50 row-2 mb-3">
        <FormLabel htmlFor="userType">User Type</FormLabel>
        <NativeSelect
          name="userType"
          value={adminData.userType}
          onChange={handleChange}
        >
          <option value={"user"}>User</option>
          <option value={"admin"}>Admin</option>
        </NativeSelect>
      </FormControl>
      <FormControl className="w-50 row-2 mb-3">
        <FormLabel htmlFor="project">Project</FormLabel>
        <NativeSelect
          name="project"
          value={adminData.project}
          onChange={handleChange}
        >
          <option value={"Jira Project"}>JIRA Project</option>
          <option value={"Comcast Project"}>Comcast Project</option>
        </NativeSelect>
      </FormControl>
      <div className="d-flex justify-content-center align-item-center w-100 gap-2 mb-3 p-0">
        <Button
          className="col-2"
          variant="contained"
          color="primary"
          sx={{ width: "100px", height: "50px" }}
          onClick={() => handleCancel()}
        >
          Cancel
        </Button>
        <Button
          className="col-2"
          variant="contained"
          color="primary"
          type="submit"
          sx={{ width: "100px", height: "50px" }}
          onClick={() => handleSubmit()}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default Admin;
