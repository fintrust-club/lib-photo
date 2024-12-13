import React, { useEffect, useState } from "react";
import { COLORS } from "src/config/typography";
import { createStyle } from "src/utils/style";
import { App, Button, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAccount } from "src/hooks/account";
import { CheckCircleTwoTone, InfoCircleTwoTone } from "@ant-design/icons";
import debounce from "lodash/debounce";
import { STORE_LINK_PREFIX } from "src/config/constant";
import Text from "src/elements/typography";
import Spacer from "src/elements/spacer";
import { REGEX } from "src/config/regex";

const MyLink = () => {
  const app = App.useApp();
  const [loading, setLoading] = useState(false);
  const account = useAccount();
  const [_link, setLink] = useState("");
  const [linkValid, setLinkValid] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const _goToDashboard = async () => {
    if (!linkValid) {
      app.message.warning("Link not available, please try another");
      return;
    }

    navigate("/signup", {
      state: {
        link: _link,
      },
    });
  };

  const _validateLink = debounce(async (link: string) => {
    let isValidLink =
      !!link && !link?.includes(" ") && REGEX.USER_LINK.test(link);
    if (isValidLink) {
      isValidLink = await account.link.validate(link);
    }

    setLinkValid(isValidLink);
  });

  useEffect(() => {
    _validateLink(_link);
  }, [_link]);

  const _handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const link = event.target.value;
    setLinkValid(false);
    const _formatted = link?.toLowerCase();
    setLink(_formatted);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Spacer align="center" mb={24}>
          <Text size={16}>Start your all in one bio link today with</Text>
          <Text size={20} variant="semibold">
            Mera Link
          </Text>
        </Spacer>
        <Input
          prefix={<Text color={COLORS.TEXT.LIGHT}>{STORE_LINK_PREFIX}</Text>}
          value={_link}
          onChange={_handleChange}
          size="large"
          suffix={
            linkValid === null || !_link ? (
              <></>
            ) : linkValid ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <InfoCircleTwoTone twoToneColor="#ff3333" />
            )
          }
        />
        <Button
          type="primary"
          size="large"
          // disabled={!linkValid}
          style={styles.cta}
          onClick={_goToDashboard}
          loading={loading}
        >
          Create mera link
        </Button>

        <Spacer mt={20}>
          <Typography.Text style={{ textAlign: "center" }}>
            Already have an account ?{" "}
            <Typography.Link
              onClick={() => {
                navigate("/signup", { replace: true });
              }}
            >
              Login
            </Typography.Link>
          </Typography.Text>
        </Spacer>
      </div>
    </div>
  );
};

export default MyLink;

const styles = createStyle({
  container: {
    background: COLORS.WHITE,
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100vh",
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
  },
  cta: {
    marginTop: "16px",
  },
});
