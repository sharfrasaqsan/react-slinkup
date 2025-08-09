import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";
import Settings from "./pages/settings/Settings";
import Notifications from "./pages/notification/Notifications";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UpdateUser from "./pages/admin/UpdateUser";
import AllUsers from "./pages/users/AllUsers";
import UserDetails from "./pages/users/UserDetails";

import ProtectedRoute from "./utils/ProtectedRoute";
import ScrollToTop from "./utils/ScrollToTop";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

import { Navigate, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import ProfileSettings from "./pages/settings/ProfileSettings";
import AccountSettings from "./pages/settings/AccountSettings";

function App() {
  const { user } = useAuth();

  return (
    <div>
      <Header />
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/post/:postId"
          element={
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          }
        />

        {/* Settings Routes */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/profile" element={<ProfileSettings />} />
        <Route path="/settings/account" element={<AccountSettings />} />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin">
          <Route
            path="dashboard/:id"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="update-user/:id"
            element={
              <AdminProtectedRoute>
                <UpdateUser />
              </AdminProtectedRoute>
            }
          />
        </Route>

        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/user/:id" element={<UserDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />

      <ScrollToTop />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
