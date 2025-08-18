import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SearchedResults from "./components/search/SearchedResults";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";
import Settings from "./pages/settings/Settings";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UpdateUser from "./pages/admin/UpdateUser";
import User from "./pages/users/User";
import ProfileSettings from "./pages/settings/ProfileSettings";
import AccountSettings from "./pages/settings/AccountSettings";
import RegisterDetails from "./pages/RegisterDetails";
import Followers from "./pages/users/Followers";
import Following from "./pages/users/Following";

import ProtectedRoute from "./utils/ProtectedRoute";
import ScrollToTop from "./utils/ScrollToTop";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";

import { useData } from "./contexts/DataContext";
import { useAuth } from "./contexts/AuthContext";

import { Navigate, Route, Routes } from "react-router";
import { Bounce, ToastContainer } from "react-toastify";
import { useState } from "react";

function App() {
  const { user } = useAuth();

  const { search } = useData();
  const [selected, setSelected] = useState("users");

  return (
    <div>
      <Header />
      <Navbar />

      <main>
        {search.trim()?.length > 0 ? (
          <SearchedResults
            search={search}
            setSelected={setSelected}
            selected={selected}
          />
        ) : (
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

            {/* Profile */}
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id/followers"
              element={
                <ProtectedRoute>
                  <Followers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id/following"
              element={
                <ProtectedRoute>
                  <Following />
                </ProtectedRoute>
              }
            />

            {/* Login & Register */}
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" /> : <Register />}
            />
            <Route
              path="/register-details"
              element={!user ? <Navigate to="/login" /> : <RegisterDetails />}
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
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/profile"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/account"
              element={
                <ProtectedRoute>
                  <AccountSettings />
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

            <Route path="/user/:id" element={<User />} />
            <Route path="/user/:id/followers" element={<Followers />} />
            <Route path="/user/:id/following" element={<Following />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>

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
