import { Button, Typography } from "antd";
import React from "react";
import { COLORS } from "src/config/typography";
import { createStyle } from "src/utils/style";
import BoxImage from "src/assets/pngs/box.png";
import { useNavigate } from "react-router-dom";
import { useAccount } from "src/hooks/account";
import { USAGE_INTENT } from "src/config/constant";

const FindProduct = () => {
  const account = useAccount();
  const navigate = useNavigate();

  const _onboard = () => {
    navigate("/onboard");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Typography.Title level={3}>Brand Collabs</Typography.Title>
      </div>
      <div style={styles.content}>
        <img src={BoxImage} alt="box" style={styles.emptyIcon} />
        <Typography.Text style={styles.desc}>
          Keep Calm, we are finding potential brands to list their product so
          that you can start collaborating with them.
        </Typography.Text>
        {account.user?.intent === USAGE_INTENT.PERSONAL && (
          <Button
            type="primary"
            size="large"
            style={styles.cta}
            onClick={_onboard}
          >
            Start Collaboration
          </Button>
        )}
      </div>
    </div>
  );
};

export default FindProduct;

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
