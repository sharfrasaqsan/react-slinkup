import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
  const fullText = "Loading, Please wait...";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedText((prev) =>
        index >= fullText.length ? "" : prev + fullText[index]
      );
      setIndex((prev) => (prev + 1) % (fullText.length + 1));
    }, 100); // Adjust typing speed here

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ margin: "auto" }}
    >
      <Spinner animation="border" role="status" variant="primary" />
      <p
        className="mt-3 fs-5 fw-medium text-primary"
        style={{ fontFamily: "monospace" }}
      >
        {displayedText}
      </p>
    </div>
  );
};

export default LoadingSpinner;
