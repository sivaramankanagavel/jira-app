import React, { useState } from "react";

import "./styles.scss";
import {
  Button,
  FormControl,
  FormLabel,
  InputLabel,
  NativeSelect,
  TextField,
} from "@mui/material";

function Admin() {
  const [adminData, setAdminData] = useState({
    email: "",
    userType: "",
    project: "",
  });

  const handleCancel = () => {
    setAdminData({
      email: "",
      userType: "",
      project: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(adminData);
  };

  return (
    <div className="d-flex flex-wrap flex-column w-75 h-100 p-0 m-0 justify-content-center align-items-center">
      <h2 className="mb-3">Add User in Current Project</h2>
      <FormControl className="w-50 row-2 mb-3">
        <FormLabel htmlFor="email-id">Email ID</FormLabel>
        <TextField
          name="email-id"
          id="email-id"
          type="email"
          placeholder="Enter Your Email.."
          autoFocus
          required
          fullWidth
          variant="outlined"
          value={adminData.email}
          onChange={(e) => {
            setAdminData({ ...adminData, email: e.target.value });
          }}
        />
      </FormControl>
      <FormControl className="w-50 row-2 mb-3">
        <FormLabel htmlFor="email-id">User Type</FormLabel>
        <NativeSelect
          value={adminData.userType}
          onChange={(e) => {
            setAdminData({ ...adminData, userType: e.target.value });
          }}
        >
          <option value={"user"}>User</option>
          <option value={"admin"}>Admin</option>
        </NativeSelect>
      </FormControl>
      <FormControl className="w-50 row-2 mb-3">
        <FormLabel htmlFor="email-id">Project</FormLabel>
        <NativeSelect
          value={adminData.project}
          onChange={(e) => {
            setAdminData({ ...adminData, project: e.target.value });
          }}
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
