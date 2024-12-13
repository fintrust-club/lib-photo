import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { useAccount } from "./hooks/account";
import OnboardPage from "./pages/onboard";
import SignupPage from "./pages/signup";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  // Switch,
  useLocation,
  useNavigate,
} from "react-router-dom";
import SuccessOnboardingPage from "./pages/onboarding_success";
import { CONFIG } from "./config";
import InfluencerLanding from "./pages/influencer";
import MyStore from "./pages/influencer/my_store";
import FindProduct from "./pages/influencer/find_product";
import MyLink from "./pages/my_link";
import InfluencerPublicListing from "./pages/influencer/public_listing";

const { Header, Sider, Content } = Layout;

function ProtectedPage() {
  return <h3>Protected</h3>;
}

function PublicPage() {
  return <h3>Public</h3>;
}

function CreaterPage() {
  return <h3>CreaterPage</h3>;
}

function BrandPage() {
  return <h3>BrandPage</h3>;
}

function Container() {
  console.log(">>>>> CONFIG", CONFIG);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Outlet />
      {!CONFIG.isProduction && (
        <div
          style={{
            background: "red",
            position: "fixed",
            top: 0,
            right: 0,
            zIndex: 100,
          }}
        >
          {CONFIG.ENV}
        </div>
      )}
    </div>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let account = useAccount();
  let location = useLocation();

  if (!account.firebaseUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return children;
}

const App: React.FC = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const account = useAccount();

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    account.init();
  }, []);

  /**
   *    {/* 
      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul> 
   */

  useEffect(() => {
    if (account.firebaseUser) navigate("/home");
    else navigate("/signup");
  }, [account?.firebaseUser]);

  return (
    <Routes>
      <Route element={<Container />}>
        <Route
          path="/dashboard/*"
          element={
            <Routes>
              <Route path="creator" element={<CreaterPage />} />
              <Route path="brand" element={<BrandPage />} />
              <Route
                path="*"
                element={
                  <Navigate
                    to="/dashboard/brand"
                    state={{ from: location }}
                    replace
                  />
                }
              />
            </Routes>
          }
        />

        <Route
          path="/onboard"
          element={
            <RequireAuth>
              <OnboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/my_link"
          element={
            <RequireAuth>
              <MyLink />
            </RequireAuth>
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/success_onboarding" element={<SuccessOnboardingPage />} />

        <Route
          path="/home/*"
          element={
            <RequireAuth>
              <InfluencerLanding />
            </RequireAuth>
          }
        >
          <Route path="find_product" element={<FindProduct />} />
          <Route path="" element={<MyStore />} />
        </Route>

        <Route path="/u/:id" element={<InfluencerPublicListing />} />
        <Route
          path="*"
          element={<Navigate to="/" state={{ from: location }} replace />}
        />
      </Route>
    </Routes>
  );

  return (
    <Layout style={{ width: "100vw", height: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: "linear-gradient(180deg, #407BFF 0%, #3362CC 100%)",
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          // theme="dark"
          style={{ background: "transparent" }}
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "nav 1",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "nav 2",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "nav 3",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Button type="primary" onClick={() => setOpen(true)}>
            Primary Button
          </Button>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
