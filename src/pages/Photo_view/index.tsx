import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./photo_view.css";

const PhotoPreview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get image data passed from the previous page
  const { state } = location;
  const { url, title, meta } = state || {};

  if (!state) {
    // Redirect back to the gallery page if no image data is provided
    navigate("/");
    return null;
  }

  return (
    <div className="photo-preview-container">
      <div className="photo-preview-header">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back
        </button>
        <h1>{title || "Photo Preview"}</h1>
      </div>

      <div className="photo-preview-content">
        <img src={url} alt={title} className="photo-preview-image" />
        <div className="photo-details">
          <p>
            <strong>Title:</strong> {title || "Untitled"}
          </p>
          <p>
            <strong>Uploaded:</strong>{" "}
            {new Date(meta?.updated).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </p>
          <p>
            <strong>Size:</strong> {((meta?.size || 0) / 1024).toFixed(2)} KB
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoPreview;
