import React from "react";
import { Link, Outlet, useMatch, useResolvedPath } from "react-router-dom";
import { createStyle } from "src/utils/style";

import { BagOutlineIcon } from "../../assets/svgs/bagOutline";
import { HomeOutlineIcon } from "src/assets/svgs/homeOutline";
import { UserOutlined } from "@ant-design/icons";
import { Typography } from "antd";

import type { LinkProps } from "react-router-dom";

function CustomLink({ children, to, ...props }: LinkProps) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link
      style={{
        fontWeight: match ? "bold" : "",
        opacity: match ? "1" : "0.4",
        color: "black",
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "11px 11px",
        flexDirection: "column",
        textDecorationLine: "none",
      }}
      to={to}
      {...props}
    >
      {children}
    </Link>
  );
}

const InfluencerLanding = () => {
  return (
    <div style={styles.screen}>
      <div style={styles.content}>
        <Outlet />
      </div>
      <div style={styles.tabContainer}>
        <CustomLink to="/home/">
          <HomeOutlineIcon />
          <Typography.Text>My Store</Typography.Text>
        </CustomLink>

        <CustomLink to="/home/find_product">
          <BagOutlineIcon />
          <Typography.Text>Find Products</Typography.Text>
        </CustomLink>

        <CustomLink to="/home/profile">
          <UserOutlined style={{ fontSize: "22px" }} />
          <Typography.Text>Profile</Typography.Text>
        </CustomLink>
      </div>
    </div>
  );
};

export default InfluencerLanding;

const styles = createStyle({
  screen: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
  tabContainer: {
    display: "flex",
    alignItems: "center",
    borderTopWidth: "1px",
  },
});
