import { Button } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { USAGE_INTENT } from "src/config/constant";
import { COLORS } from "src/config/typography";
import Spacer from "src/elements/spacer";
import Text from "src/elements/typography";
import { useAccount } from "src/hooks/account";
import { createStyle } from "src/utils/style";

const UsageIntent = () => {
  const [selected, setSelected] = useState<USAGE_INTENT | null>(null);
  const navigate = useNavigate();
  const account = useAccount();

  const _continue = async () => {
    if (!selected) return;

    await account.profile.update({
      intent: selected,
    });
    if (selected === USAGE_INTENT.BRAND_COLLAB) {
      navigate("/onboard");
    } else {
      navigate("/about");
    }
  };

  const _select = async (intent: USAGE_INTENT) => {
    setSelected(intent);
  };

  const _renderButton = (
    title = "",
    subTitle = "",
    onClick: () => void,
    selected = false
  ) => {
    return (
      <div style={selected ? styles.cardActive : styles.card} onClick={onClick}>
        <Text variant="medium" size={16}>
          {title}
        </Text>
        <Spacer mt={11}>
          <Text size={12}>{subTitle}</Text>
        </Spacer>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Spacer mb={24}>
          <Text variant="medium" size={20}>
            Why choose Mera Link ?
          </Text>
        </Spacer>
        {_renderButton(
          "Create bio link only",
          "Create a bio-link for all your social media in just a couple of steps.",
          () => _select(USAGE_INTENT.PERSONAL),
          selected === USAGE_INTENT.PERSONAL
        )}
        {_renderButton(
          "Start Collaborating with brands",
          "Mera link is connecting with brands to list their products in our platform so that creators can resell and earn commissions",
          () => _select(USAGE_INTENT.BRAND_COLLAB),
          selected === USAGE_INTENT.BRAND_COLLAB
        )}
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          disabled={!selected}
          onClick={_continue}
          style={styles.cta}
        >
          {"Continue"}
        </Button>
      </div>
    </div>
  );
};

export default UsageIntent;

const styles = createStyle({
  container: {
    background: COLORS.WHITE,
    display: "flex",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    flexDirection: "column",
    overflow: "scroll",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },
  card: {
    borderRadius: 4,
    boxShadow: "0px 2px 5px 0px rgba(0, 0, 0, 0.1)",
    marginBottom: "6px",
    padding: "16px",
    paddingBottom: "24px",
    border: "1.5px solid",
    borderColor: COLORS.WHITE,
  },
  cardActive: {
    borderRadius: 4,
    boxShadow: "0px 2px 5px 0px rgba(0, 0, 0, 0.1)",
    marginBottom: "6px",
    padding: "16px",
    border: "1.5px solid",
    borderColor: COLORS.NIMBUS_BLUE,
    paddingBottom: "24px",
  },
  cta: {
    marginTop: "24px",
  },
});
