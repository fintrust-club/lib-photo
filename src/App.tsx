import * as React from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { useAccount } from "./hooks/account";
import Gallery from "./pages/gallery";

import { Spin } from "antd";
import { createStyle } from "./utils/style";
import { CONFIG } from "./config";
import PhotoPreview from "./pages/Photo_view";

const Loader = () => {
  return (
    <div style={styles.container}>
      <Spin size="large" />
    </div>
  );
};

const ExternalRedirect = ({ url }: { url: string }) => {
  const redirectToExternalUrl = () => {
    window.location.href = url;
  };

  redirectToExternalUrl();
  return null;
};

export default function App() {
  let location = useLocation();
  const account = useAccount();

  React.useEffect(() => {
    account.init();
  }, []);

  if (!account.initilized) return <Loader />;
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/home" element={<Gallery />} />
        <Route path="/photoview" element={<PhotoPreview />} />

        <Route
          path="*"
          element={<Navigate to="/home" state={{ from: location }} replace />}
        />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
      }}
    >
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

const styles = createStyle({
  container: {
    width: "100vw",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});
