import React, { useEffect, useState } from "react";
import { Avatar, ConfigProvider, Flex, Segmented, Typography } from "antd";
import { createStyle } from "src/utils/style";
import { COLORS } from "src/config/typography";
import { useAccount } from "src/hooks/account";
import { STORE_LINK_PREFIX } from "src/config/constant";
import { UserOutlined } from "@ant-design/icons";
import { RemoteImageManager } from "src/core/firebase/image";

type Props = {
  publicUser?: boolean;
  name?: string;
  link?: string;
  onChangeTab?: (tab: string) => void;
  selectedTab?: string;
  tabShown?: boolean;
  profileUrl?: string;
  desc?: string;
};

const UserHeader = ({
  tabShown = true,
  publicUser = false,
  name = "",
  link = "",
  profileUrl = "",
  desc = "",
  selectedTab,
  onChangeTab,
}: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const account = useAccount();

  const influencerName = publicUser ? name : account.user?.name;
  const InfluencerLink = publicUser
    ? STORE_LINK_PREFIX + link
    : STORE_LINK_PREFIX + account.user?.link ?? "";
  const InfluencerProfile = publicUser
    ? profileUrl
    : account.user?.profileUrl ?? "";
  const InfluencerDesc = publicUser ? desc : account.user?.description ?? "";

  useEffect(() => {
    if (InfluencerProfile) {
      RemoteImageManager.getUrl(InfluencerProfile)
        .then((_url) => {
          setImageUrl(_url ?? null);
        })
        .catch((err: any) => {
          console.log("couldnt fetch url", err);

          setImageUrl(null);
        });
    }
  }, [InfluencerProfile]);

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#00b96b",
          borderRadius: 10,

          // Alias Token
          colorBgContainer: "#f6ffed",
        },
        components: {
          Segmented: {
            itemSelectedBg: "#CFFFB3",
            trackPadding: 0,
          },
        },
      }}
    >
      <div style={styles.container}>
        <Flex vertical align="center">
          <Flex vertical align="center">
            {InfluencerProfile ? (
              <Avatar src={imageUrl} size={70} />
            ) : (
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
                size={70}
              />
            )}
            <Typography.Title level={3} style={{ marginTop: "8px" }}>
              {influencerName}
            </Typography.Title>
            <Typography.Link copyable={!publicUser}>
              {InfluencerLink}
            </Typography.Link>
            {!!InfluencerDesc && (
              <Typography.Text
                style={{ marginTop: "8px", textAlign: "center" }}
              >
                {InfluencerDesc}
              </Typography.Text>
            )}
          </Flex>
          {tabShown ? (
            <Segmented
              style={{ marginTop: "24px", borderRadius: "12px" }}
              options={[
                {
                  value: "store",
                  label: (
                    <div style={{ padding: "0px 10px" }}>
                      <Typography.Text>Store</Typography.Text>
                    </div>
                  ),
                },
                {
                  value: "links",
                  label: (
                    <div style={{ padding: "0px 10px" }}>
                      <Typography.Text>Links</Typography.Text>
                    </div>
                  ),
                },
              ]}
              onChange={onChangeTab}
              value={selectedTab}
              size="large"
            />
          ) : (
            <></>
          )}
        </Flex>
      </div>
    </ConfigProvider>
  );
};

export default UserHeader;

const styles = createStyle({
  container: {
    background: COLORS.WHITE,
    display: "flex",
    flexDirection: "column",
    padding: "40px 20px 20px 20px",
  },

  menu: {
    padding: "12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "10px",
    borderColor: COLORS.SILVER_MEDAL,
  },
  copyIcon: {
    marginLeft: "8px",
  },
  desc: {
    marginTop: "20px",
    color: COLORS.LILAC_FIELDS,
  },
});
