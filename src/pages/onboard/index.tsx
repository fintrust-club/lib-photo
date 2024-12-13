import {
  Button,
  Checkbox,
  Flex,
  Form,
  Image,
  Input,
  Select,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useAccount } from "../../hooks/account";
import { REGEX } from "src/config/regex";
import { useNavigate } from "react-router-dom";

type SizeType = Parameters<typeof Form>[0]["size"];

type FieldType = {
  email?: string;
  story_cost: string;
  post_cost: string;
  reel_cost: string;
  currency: string;
};

const CONTENT_CATEGORY = [
  { key: "lifestyle", label: "Lifestyle" },
  { key: "fitness", label: "Fitness" },
  { key: "food", label: "Food" },
  { key: "travel", label: "Travel" },
  { key: "tech_games", label: "Tech & Games" },
  { key: "fashion_beauty", label: "Fashion & Beauty" },
  { key: "others", label: "Others" },
];

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accout = useAccount();

  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const _renderHeader = () => {
    return (
      <Flex style={styles.header} justify={"space-between"} align={"center"}>
        <Image width={120} src={require("src/assets/pngs/logo.png")} />

        {/* <Button
          type="primary"
          onClick={async () => {
            if (accout.user) {
              accout.signOut();
            } else {
              accout.signInEmail("admin@buzbridge.com", "admin123");
            }
          }}
        >
          {accout.user ? "Logout" : "Login"}
        </Button> */}
      </Flex>
    );
  };

  return (
    <div style={styles.screen}>
      {_renderHeader()}
      <div style={styles.content}>
        <Typography.Text>
          Welcome to Mera-link, please fill up the form to continue
        </Typography.Text>
        <Form
          layout="vertical"
          initialValues={{ size: componentSize }}
          onValuesChange={onFormLayoutChange}
          size={componentSize as SizeType}
          style={{ maxWidth: 600, marginTop: "24px" }}
          onFinish={async (formData) => {
            setLoading(true);
            const {
              based_in,
              consent_terms,
              content_category,
              email,
              followers_count,
              instagram_id,
              name,
              phone,
              post_cost,
              reel_cost,
              story_cost,
              currency = "INR",
            } = formData ?? {};
            console.log("DATA SAVING", {
              based_in,
              consent_terms,
              content_category,
              email,
              followers_count,
              instagram_id,
              name,
              phone,
              post_cost,
              reel_cost,
              story_cost,
              currency,
            });

            await accout.updateProfile({
              based_in,
              content_category,
              email,
              followers_count,
              instagram_id,
              name,
              phone,
              post_cost,
              reel_cost,
              story_cost,
              currency: currency ?? "INR",
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
            <Input />
          </Form.Item>
          <Form.Item
            name="instagram_id"
            label="Instagram Id"
            rules={[{ required: true, message: "This is required" }]}
          >
            <Input prefix="@" />
          </Form.Item>
          <Form.Item
            name="followers_count"
            label="How many followers do you have now ?"
            rules={[{ required: true, message: "This is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Contact Mail Id"
            rules={[
              { required: true, message: "This is required" },
              {
                pattern: REGEX.EMAIL,
                message: "Invalid email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Contact Number"
            rules={[
              {
                pattern: REGEX.MOBILE_NUMBER,
                message: "Invalid phone number",
              },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item name="based_in" label="Where are you based in?">
            <Input />
          </Form.Item>

          <Form.Item
            name="content_category"
            label="What is your content category?"
          >
            <Select placeholder="Select a category" allowClear>
              {CONTENT_CATEGORY.map((options) => {
                return (
                  <Select.Option value={options.key}>
                    {options.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Typography.Text>
            Tell us how much you charge per content
          </Typography.Text>

          <Form.Item name="currency" label="">
            <Select
              defaultValue="INR"
              style={{ marginTop: "20px" }}
              options={[
                { value: "INR", label: "INR (₹)" },
                { value: "USD", label: "USD ($)" },
              ]}
            />
          </Form.Item>

          <Flex style={{ marginTop: "20px" }}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.currency !== currentValues.currency
              }
            >
              {({
                getFieldValue,
              }: {
                getFieldValue: (field: string) => any;
              }) => (
                <Form.Item<FieldType>
                  name="reel_cost"
                  label="Reel"
                  rules={[
                    {
                      pattern: REGEX.NUMBER,
                      message: "Invalid number",
                    },
                  ]}
                >
                  <Input
                    prefix={getFieldValue("currency") === "USD" ? "$" : "₹"}
                  />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.currency !== currentValues.currency
              }
            >
              {({
                getFieldValue,
              }: {
                getFieldValue: (field: string) => any;
              }) => (
                <Form.Item<FieldType>
                  name="story_cost"
                  label="Story"
                  style={{ marginLeft: "8px" }}
                  rules={[
                    {
                      pattern: REGEX.NUMBER,
                      message: "Invalid number",
                    },
                  ]}
                >
                  <Input
                    prefix={getFieldValue("currency") === "USD" ? "$" : "₹"}
                  />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.currency !== currentValues.currency
              }
            >
              {({
                getFieldValue,
              }: {
                getFieldValue: (field: string) => any;
              }) => (
                <Form.Item<FieldType>
                  name="post_cost"
                  label="Post"
                  style={{ marginLeft: "8px" }}
                  rules={[
                    {
                      pattern: REGEX.NUMBER,
                      message: "Invalid number",
                    },
                  ]}
                >
                  <Input
                    prefix={getFieldValue("currency") === "USD" ? "$" : "₹"}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Flex>
          <Form.Item name="consent_terms">
            <Checkbox required>
              Agree to
              <Button
                type="link"
                onClick={() =>
                  window.open(
                    "https://www.buzbridge.com/terms-and-conditions",
                    "_blank"
                  )
                }
              >
                terms and conditions
              </Button>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {}}
              block
              size="large"
              loading={loading}
            >
              {"Join Mera-link"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;

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
