import { Flex, Image, Typography } from "antd";
import React from "react";
import { CheckCircleTwoTone } from "@ant-design/icons";

const SuccessOnboardingPage = () => {
  const _renderHeader = () => {
    return (
      <Flex style={styles.header} justify={"space-between"} align={"center"}>
        <Image width={120} src={require("src/assets/pngs/logo.png")} />
      </Flex>
    );
  };

  return (
    <div style={styles.screen}>
      {_renderHeader()}
      <div style={styles.content}>
        <CheckCircleTwoTone
          twoToneColor="#52c41a"
          style={{ fontSize: "30vw" }}
        />
        <Typography.Title style={{ textAlign: "center" }}>
          {"Thanks for registering in Buzbridge"}
        </Typography.Title>
        <Typography.Text style={{ textAlign: "center" }}>
          Stay calm, our team will get back to you with latest brand
          collaborations !
        </Typography.Text>
      </div>
    </div>
  );
};

export default SuccessOnboardingPage;

type StyleSheet = { [key: string]: React.CSSProperties };
function createStyle<T extends StyleSheet>(data: T): T {
  return data;
}

const styles = createStyle({
  screen: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    borderRadius: 6,
    padding: "20px 20px",
    boxShadow: "0px 2px 20.600000381469727px 0px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: "24px 20px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
});
