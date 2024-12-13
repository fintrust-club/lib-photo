import React, { useState } from "react";
import { COLORS } from "src/config/typography";
import { createStyle } from "src/utils/style";
import UserHeader from "src/components/user_header";
import { Button, Flex } from "antd";
import { useAccount } from "src/hooks/account";
import { useNavigate } from "react-router-dom";

const InfluProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const account = useAccount();

  const _logout = async () => {
    setLoading(true);
    await account.signOut();
    setLoading(false);
  };

  const _edit = () => {
    navigate("/home/profile/edit");
  };

  return (
    <div style={styles.container}>
      <UserHeader tabShown={false} />

      <div style={styles.content}></div>
      <Flex
        style={{
          margin: "32px 20px",
        }}
      >
        <Button
          style={{
            backgroundColor: "transparent",
            flex: 1,
          }}
          type="default"
          size="large"
          danger
          loading={loading}
          onClick={_logout}
        >
          {"Logout"}
        </Button>
        <Button
          style={{ marginLeft: "16px", flex: 1 }}
          type="primary"
          ghost
          size="large"
          loading={loading}
          onClick={_edit}
        >
          {"Edit profile"}
        </Button>
      </Flex>
    </div>
  );
};

export default InfluProfile;

const styles = createStyle({
  container: {
    background: COLORS.PLACEBO_BLUE,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    background: COLORS.WHITE,
    padding: "40px 20px 20px 20px",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },
  emptyIcon: {
    width: "140px",
    height: "140px",
  },
  desc: {
    textAlign: "center",
    marginBottom: "12px",
    marginTop: "12px",
  },
  cta: {
    marginTop: "24px",
  },
});
