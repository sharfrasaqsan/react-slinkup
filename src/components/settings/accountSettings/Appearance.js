import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { IoIosMoon } from "react-icons/io";
import { IoSunnyOutline } from "react-icons/io5";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import "../../../styles/settings/Setting.css";

const Appearance = () => {
  const [previewTheme, setPreviewTheme] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updated, setUpdated] = useState(true);
  const initialTheme = useRef(null);

  // On mount: load theme before rendering
  useEffect(() => {
    const stored = localStorage.getItem("theme") || "light";
    initialTheme.current = stored;
    setPreviewTheme(stored);
    document.documentElement.setAttribute("data-bs-theme", stored);
  }, []);

  // Apply preview theme whenever toggled
  useEffect(() => {
    if (previewTheme) {
      document.documentElement.setAttribute("data-bs-theme", previewTheme);
    }
  }, [previewTheme]);

  // On unmount: revert if not updated
  useEffect(() => {
    return () => {
      if (!updated && initialTheme.current) {
        localStorage.setItem("theme", initialTheme.current);
        document.documentElement.setAttribute(
          "data-bs-theme",
          initialTheme.current
        );
      }
    };
  }, [updated]);

  const handleUpdate = () => {
    setUpdateLoading(true);
    setTimeout(() => {
      localStorage.setItem("theme", previewTheme);
      initialTheme.current = previewTheme;
      setUpdated(true);
      setUpdateLoading(false);
    }, 1000);
  };

  // ⛔ Prevent flashing by avoiding early render
  if (previewTheme === null) return null;

  return (
    <div className="container profile-settings-container">
      <form
        className="privacy-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <p className="privacy-text m-0">Theme Mode</p>

          <Form.Check
            type="switch"
            id="darkmode"
            label={previewTheme === "dark" ? <IoSunnyOutline /> : <IoIosMoon />}
            checked={previewTheme === "dark"}
            onChange={() => {
              setPreviewTheme((prev) => (prev === "dark" ? "light" : "dark"));
              setUpdated(false);
            }}
            className="privacy-switch"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mt-4"
          disabled={updated || updateLoading}
        >
          {updateLoading ? (
            <>
              Updating... <ButtonSpinner />
            </>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};

export default Appearance;
