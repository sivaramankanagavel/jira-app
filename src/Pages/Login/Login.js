import { useEffect, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle } from "../../redux-store/slice/login-slice";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { loginEndPointAsyncFunc } from "../../redux-store/slice/login-endpoint-slice";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import "./styles.scss";
import { fetchProjects } from "../../redux-store/slice/project-slice";

function Login() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.login?.isLoggedIn);
  const userLoginDetail = useSelector((state) => state?.login?.user);
  const userData = useSelector((state) => state?.loginEndpoint?.userData?.userData);
  const userStatus = useSelector((state) => state?.loginEndpoint);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginWithGoogle());
  };

  useEffect(() => {
    console.log(userLoginDetail, isLoggedIn);
    console.log(userStatus.isPending, userStatus.isError, userData);
    if (isLoggedIn) {
      if (
        userData['userId'] &&
        userStatus.isPending === false &&
        userStatus.isError === false
      ) {
        navigate("/");
      } else if (userStatus.isPending === false && userStatus.isError === true) {
        setOpen(true);
      } else if (userData['userId'] === null && userStatus.isPending !== true) {
        dispatch(loginEndPointAsyncFunc(userLoginDetail['email']));
      }
    }
  }, [isLoggedIn, userData]);

  useEffect(() => {
    if(userData['userId'] !== null){
      console.log("USER ID:--->", userData['userId'])
      dispatch(fetchProjects(userData['userId']));
    }
  }, [userData]);

  return (
    <div className="login-container d-flex flex-wrap flex-column justify-content-center align-items-center">
      <h1 className="login-container__heading">
        Login <LoginIcon sx={{ fontSize: 50 }} />
      </h1>
      <FormControl className="w-50 row-2 mb-2">
        <FormLabel htmlFor="email-id">Email Id</FormLabel>
        <TextField
          name="email"
          id="email-id"
          type="email"
          placeholder="Enter Your Email.."
          autoFocus
          required
          fullWidth
          variant="outlined"
        />
      </FormControl>
      <FormControl className="w-50 row-2 mb-2">
        <FormLabel htmlFor="password">Password</FormLabel>
        <TextField
          name="password"
          id="password"
          type="password"
          placeholder="Password..."
          required
          fullWidth
          variant="outlined"
        />
      </FormControl>
      <Button
        className="w-50 row-1 mb-2"
        variant="contained"
        color="primary"
        type="submit"
      >
        Sign In
      </Button>
      <Divider className="w-50 row-1 mb-2">Or</Divider>
      <Button
        className="w-50 row-1 mb-2"
        variant="contained"
        color="primary"
        startIcon={<GoogleIcon />}
        onClick={handleSubmit}
      >
        Sign in with Google
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          variant="filled"
          severity="error"
          sx={{ width: "100%" }}
        >
          User was Not Registerd for this JIRA Account. Please contact your
          Admin.
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;
