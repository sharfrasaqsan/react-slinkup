import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Explore from "./pages/Expolore";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

import PrivateRoute from "./utils/PrivateRoute";

import { Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <div>
      <Header />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/explore"
          element={
            <PrivateRoute>
              <Explore />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/post/:postId"
          element={
            <PrivateRoute>
              <PostDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
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
