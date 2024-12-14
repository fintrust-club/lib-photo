import React, { useEffect, useState } from "react";
import { Pagination, Select } from "antd";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import "./Gallery.css";

const { Option } = Select;

const GalleryPage = () => {
  const [images, setImages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest"); // State for sort order
  const itemsPerPage = 15;
  const navigate = useNavigate();

  const fetchImages = async () => {
    try {
      const storage = getStorage();
      const folderRef = ref(storage, "data");

      const result = await listAll(folderRef);

      const urls = await Promise.all(
        result.items.map(async (itemRef) => ({
          url: await getDownloadURL(itemRef),
          title: itemRef?.name,
          id: itemRef?.fullPath,
          meta: await getMetadata(itemRef),
        }))
      );

      setImages(urls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  // Sort images based on selected order
  const sortedImages = [...images].sort((a, b) => {
    const dateA = new Date(a.meta.updated).getTime();
    const dateB = new Date(b.meta.updated).getTime();

    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  const paginatedImages = sortedImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleImageClick = (image: any) => {
    navigate("/photoview", { state: image });
  };

  return (
    <div
      style={{
        padding: "24px 20px",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Heading */}
      <h1 style={{ textAlign: "center", marginBottom: "16px" }}>My Days</h1>

      {/* Sorting Dropdown */}
      <div style={{ marginBottom: "16px", textAlign: "center" }}>
        <Select
          defaultValue="latest"
          style={{ width: 200 }}
          onChange={handleSortChange}
        >
          <Option value="latest">Latest to Oldest</Option>
          <Option value="oldest">Oldest to Latest</Option>
        </Select>
      </div>

      <div
        className="gallery-container"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          overflow: "auto",
        }}
      >
        {paginatedImages.map((item) => (
          <div
            key={item.id}
            className="image-wrapper"
            onClick={() => handleImageClick(item)} // Navigate on click
          >
            <img src={item.url} alt={item.title} />
            <div className="overlay">
              <h3>{item.title}</h3>
              <p>
                {new Date(item.meta.updated).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={images.length}
        onChange={handlePageChange}
        className="pagination"
      />
    </div>
  );
};

export default GalleryPage;
