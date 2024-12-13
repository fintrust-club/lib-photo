import { App, Button, Form, Image, Input } from "antd";
import React, { useState } from "react";
import { useAccount } from "../../hooks/account";
import { useLocation, useNavigate } from "react-router-dom";
import { createStyle } from "src/utils/style";
import { fb } from "src/core/firebase/setup";
import Spacer from "src/elements/spacer";

type SizeType = Parameters<typeof Form>[0]["size"];

type FieldType = {
  email?: string;
  password?: string;
  password_2?: string;
};

const SignupPage = () => {
  let location = useLocation();
  let from = location.state?.from?.pathname || "/";
  let link = location.state?.link ?? null;

  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(!!link);
  const app = App.useApp();

  const navigate = useNavigate();
  const accout = useAccount();

  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const _register = async (fileds: FieldType) => {
    try {
      setLoading(true);
      const { email, password, password_2 } = fileds ?? {};

      if (isSignIn) {
        if (!email || !password || !password_2)
          throw new Error("Required field missing");
        if (password !== password_2)
          throw new Error("Passwords are not matching");
      } else {
        if (!email || !password) throw new Error("Required field missing");
      }

      let user;
      if (!isSignIn) {
        user = await accout.signInEmail(email, password);
      } else {
        user = await accout.createAccount(email, password);
      }
      if (!!user) fb.logEvent("login_success");

      console.log(">>>>>>>>user", user);

      if (user && user?.email) {
        const profile = await accout.getProfile(user?.email);
        console.log(">>>>>>>>profile", profile);

        if (!!link) await accout.link.update(link, user?.email);

        if (profile?.intent) {
          navigate("/home", { replace: true });
        } else {
          navigate("/intent", { replace: true });
        }
      } else {
        throw new Error("Unable to signin");
      }
    } catch (err: any) {
      const message = err?.message ?? "Something went wrong!";

      app.message.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.screen}>
      <div style={styles.content}>
        <Spacer align="center">
          <Image width={200} src={require("src/assets/pngs/logo.png")} />
        </Spacer>
        <Form
          layout="vertical"
          initialValues={{ size: componentSize }}
          onValuesChange={onFormLayoutChange}
          size={componentSize as SizeType}
          style={{ maxWidth: 600, marginTop: "24px" }}
          onFinish={_register}
        >
          <Form.Item
            name="email"
            label="Mail Id"
            rules={[{ required: true, message: "This is required" }]}
            initialValue={accout?.onboarding?.data?.email}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          {isSignIn && (
            <Form.Item<FieldType>
              label="Confirm Password"
              name="password_2"
              rules={[
                {
                  required: true,
                  message: "Please input your password again!",
                },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              style={{ marginTop: "32px" }}
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              {!isSignIn ? "Login" : "Sign-up"}
            </Button>
          </Form.Item>

          <Button
            type="link"
            block
            size="large"
            onClick={() => setIsSignIn((pre) => !pre)}
          >
            {isSignIn ? "Login" : "Signup"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;

const styles = createStyle({
  screen: {
    height: "100vh",
    width: "100vw",
    display: "flex",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
});
