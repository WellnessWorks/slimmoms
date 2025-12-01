// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";
// import {
//   selectIsLoggedIn,
//   selectIsRefreshing,
// } from "../redux/auth/authSelectors";

// export default function PrivateRoute({ children }) {
//   const isLoggedIn = useSelector(selectIsLoggedIn);
//   const isRefreshing = useSelector(selectIsRefreshing);

//   if (isRefreshing) {
//     return <div>Loading...</div>;
//   }

//   return isLoggedIn ? children : <Navigate to="/" replace />;
// }
