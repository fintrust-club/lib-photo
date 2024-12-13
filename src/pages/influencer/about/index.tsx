import { Button, Flex, Form, Input } from "antd";
import React, { useState } from "react";
import { useAccount } from "../../../hooks/account";
import { useNavigate } from "react-router-dom";
import Text from "src/elements/typography";
import { REGEX } from "src/config/regex";

const AboutYou = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accout = useAccount();

  const _renderHeader = () => {
    return (
      <Flex style={styles.header} justify={"space-between"} align={"center"}>
        <Text size={20} variant="semibold">
          About you
        </Text>
      </Flex>
    );
  };

  return (
    <div style={styles.screen}>
      {_renderHeader()}
      <div style={styles.content}>
        <Form
          layout="vertical"
          style={{ maxWidth: 600, marginTop: "24px" }}
          onFinish={async (formData) => {
            setLoading(true);
            const { name, email, description } = formData ?? {};

            await accout.profile.update({
              name,
              email,
              description,
            });

            navigate("/home", { replace: true });
            setLoading(false);
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "This is required" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Id"
            rules={[
              { required: true, message: "This is required" },
              {
                pattern: REGEX.EMAIL,
                message: "Invalid email",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "This is required" }]}
          >
            <Input.TextArea rows={4} size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              {"Continue"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AboutYou;

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
    overflow: "hidden",
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
    overflow: "scroll",
  },
});
