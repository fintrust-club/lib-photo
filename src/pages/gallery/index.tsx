import { Image, Carousel } from "antd";
import React, { useRef, useState } from "react";
import { createStyle } from "src/utils/style";
import Spacer from "src/elements/spacer";

const GalleryPage = () => {
  // Dummy data for 20 items
  const carouselData = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    year: 2000 + index,
    description: `Event description for year ${2000 + index}`,
    imageUrl: `https://picsum.photos/id/${237 + index}/200/300`,
  }));

  const carouselRef = useRef<any>(null);
  const [selectedTimeline, setSelectedTimeline] = useState(null);

  // Handler for timeline click
  const handleTimelineClick = (index: any) => {
    setSelectedTimeline(index);
    carouselRef.current?.goTo?.(index);
  };

  return (
    <div style={styles.screen}>
      <div style={styles.content}>
        {/* Logo Section */}
        <Spacer align="center">
          <Image width={200} src={require("src/assets/pngs/logo.png")} />
        </Spacer>

        {/* Carousel Section */}
        <div style={styles.carouselContainer}>
          <Carousel ref={carouselRef} autoplay>
            {carouselData.map((item) => (
              <div key={item.id}>
                <img
                  src={item.imageUrl}
                  alt={`Image ${item.id}`}
                  style={styles.carouselImage}
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Timeline Section */}
        <div style={styles.timelineContainer}>
          {carouselData.map((item, index) => (
            <div
              key={item.id}
              style={{
                ...styles.timelineItem,
                backgroundColor:
                  selectedTimeline === index ? "#e6f7ff" : "white",
              }}
              onClick={() => handleTimelineClick(index)}
            >
              <h3>{item.year}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;

const styles = createStyle({
  screen: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  carouselContainer: {
    width: "80%",
    marginTop: 20,
  },
  carouselImage: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    borderRadius: 8,
  },
  timelineContainer: {
    marginTop: 20,
    width: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  timelineItem: {
    marginBottom: 10,
    padding: 10,
    borderLeft: "2px solid #1890ff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
});
