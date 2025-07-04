import { useEffect, useState, useCallback } from "react";
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
import { fetchProjects } from "../../redux-store/slice/project-slice";

import "./styles.scss";

function Login() {
  const [open, setOpen] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.login?.isLoggedIn);
  const userLoginDetail = useSelector((state) => state?.login?.user);
  const userData = useSelector((state) => state?.loginEndpoint?.userData);
  const userStatus = useSelector((state) => state?.loginEndpoint);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoginAttempted(false);
    dispatch(loginWithGoogle());
  };

  // Wrap in useCallback to prevent unnecessary recreations
  const handleLoginEndpoint = useCallback(() => {
    if (
      !loginAttempted &&
      userLoginDetail?.email &&
      !userData?.userId &&
      !userStatus.isPending
    ) {
      setLoginAttempted(true);
      dispatch(
        loginEndPointAsyncFunc({
          email: userLoginDetail.email,
          name: userLoginDetail.displayName,
          oauthProviderId: userLoginDetail.providerId,
        })
      );
    }
  }, [loginAttempted, userLoginDetail, userData, userStatus, dispatch]);

  const handleLoginSuccess = useCallback(() => {
    if (userData?.userId) {
      // 1. Fetch projects for the user
      dispatch(fetchProjects({ userId: userData.userId }));

      // 2. Navigate to home
      navigate("/");
    }
  }, [userData, dispatch, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
    if (userData?.userId && !userStatus.isPending && !userStatus.isError) {
      handleLoginSuccess();
    } else if (userStatus.isPending === false && userStatus.isError === true) {
      setOpen(true);
    } else {
      handleLoginEndpoint();
    }
  }
  }, [isLoggedIn, userData, userStatus, handleLoginEndpoint, handleLoginSuccess]);

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
