import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataProvider } from "./contexts/DataContext";
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AuthProvider>
  </BrowserRouter>
);
