import "./styles.scss";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector(
    (state) =>
      state.auth.googleAuth?.isLoggedIn &&
      state.auth.backendAuth?.userData?.userId &&
      localStorage.getItem("jwt") // Additional check for JWT
  );

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
