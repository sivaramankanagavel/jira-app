import React, { useEffect } from "react";
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
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";

import "./styles.scss";

function Login() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.login?.isLoggedIn);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginWithGoogle());
  };

  useEffect(() => {
    if(isLoggedIn){
      navigate('/')
    }
  }, [isLoggedIn])

  return (
    <div className="login-container d-flex flex-wrap flex-column justify-content-center align-items-center">
      <h1 className="login-container__heading">Login <LoginIcon sx={{ fontSize: 50 }}/></h1>
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
    </div>
  );
}

export default Login;
