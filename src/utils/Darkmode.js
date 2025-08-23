import { useEffect, useState } from "react";
import { IoIosMoon } from "react-icons/io";
import { IoSunnyOutline } from "react-icons/io5";

const Darkmode = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div>
      <button
        className="btn btn-outline-secondary"
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      >
        {theme === "dark" ? <IoSunnyOutline /> : <IoIosMoon />}
      </button>
    </div>
  );
};

export default Darkmode;
