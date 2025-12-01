import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../redux/auth/authSelectors";

export default function RestrictedRoute({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return !isLoggedIn ? children : <Navigate to="/" replace />;
}
