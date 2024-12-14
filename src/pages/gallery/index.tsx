import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import "./Gallery.css";

const GalleryPage = () => {
  const [images, setImages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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

  const paginatedImages = images.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <div key={item.id} className="image-wrapper">
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
