import React, { useEffect, useState } from "react";
import UserHeader from "src/components/user_header";
import { COLORS } from "src/config/typography";
import { createStyle } from "src/utils/style";
import BoxImage from "src/assets/pngs/box.png";
import { Flex, Spin, Typography } from "antd";
import { useInfluListing } from "src/hooks/influencerListing";
import { Link, useNavigate } from "react-router-dom";
import ChainImage from "src/assets/pngs/chain.png";
import { useInfLink } from "src/hooks/link";
import { ArrowRightOutlined } from "@ant-design/icons";
import { LINK_ICONS } from "src/config/links";
import WebsiteIcon from "src/assets/pngs/website.png";
import { useProducts } from "src/hooks/products";
import ProductCard from "src/components/productCard";

const InfluencerPublicListing = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("links");
  const isLinksTab = tab === "links";
  const { influ, loading } = useInfluListing();
  const products = useProducts();

  const inf = useInfLink();

  useEffect(() => {
    if (influ?.email) {
      inf.fetch(influ?.email);
      products.fetch(influ?.email);
    }
  }, [influ?.email]);

  const desc = "Sorry no products available at this time :(";

  const _openProduct = (product: any) => {
    window.open(product?.link, "_blank");
  };

  const _getIcon = (icon_type: string) => {
    return (
      LINK_ICONS?.find((item) => item?.key === icon_type)?.icon ?? WebsiteIcon
    );
  };

  const _renderLinksEmpty = () => (
    <div style={styles.content}>
      <img src={ChainImage} alt="box" style={styles.emptyIconSmall} />
      <Typography.Text style={styles.desc}>
        {influ?.name} haven’t added any links
      </Typography.Text>
    </div>
  );

  const _renderStoreEmpty = () => (
    <div style={styles.content}>
      <img src={BoxImage} alt="box" style={styles.emptyIcon} />
      <Typography.Text style={styles.desc}>{desc}</Typography.Text>
    </div>
  );

  const _renderLinks = () => (
    <Flex style={{ padding: "24px 20px" }} vertical flex={1}>
      <Flex vertical flex={1}>
        {inf?.links?.map((_link) => (
          <Link to={_link?.link} target="_blank">
            <div
              style={{
                marginBottom: "16px",
                backgroundColor: COLORS.WHITE,
                padding: "16px",
                borderRadius: "12px",
              }}
            >
              <Flex justify="space-between" align="center" flex={1}>
                <Flex justify="flex-start" align="center">
                  <img
                    style={{ width: "30px", height: "30px" }}
                    src={_getIcon(_link?.icon_type)}
                    alt={_link?.icon_type}
                  />
                  <Typography.Title
                    level={5}
                    style={{ padding: 0, margin: 0, marginLeft: "12px" }}
                  >
                    {_link?.label ?? "-"}
                  </Typography.Title>
                </Flex>

                <ArrowRightOutlined style={{ color: "black" }} />
              </Flex>
            </div>
          </Link>
        ))}
      </Flex>
      {/* <Typography.Text style={{ textAlign: "center" }}>
        Start your own{" "}
        <Typography.Link
          onClick={() => {
            navigate("/signup");
          }}
        >
          Mera Link
        </Typography.Link>
      </Typography.Text> */}
    </Flex>
  );

  const _renderProducts = () => (
    <Flex style={{ padding: "24px 20px" }} vertical flex={1}>
      <Flex vertical flex={1}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {products?.products?.map((_link: any, index: number) => (
            <ProductCard
              title={_link?.name ?? "-"}
              link={_link?.link ?? "-"}
              style={{
                marginLeft: index % 2 !== 0 ? "16px" : "0px",
              }}
              onClick={() => _openProduct(_link)}
              imagePath={_link?.imagePath}
              key={_link?.name + index}
            />
          ))}
        </div>
      </Flex>
    </Flex>
  );

  const _renderContent = () => {
    if (isLinksTab) {
      return inf?.links?.length ? _renderLinks() : _renderLinksEmpty();
    } else {
      return products?.products?.length
        ? _renderProducts()
        : _renderStoreEmpty();
    }
  };

  return (
    <div style={styles.container}>
      {influ ? (
        <>
          <UserHeader
            publicUser
            name={influ?.name}
            link={influ?.link}
            onChangeTab={(tab: string) => setTab(tab)}
            selectedTab={tab}
            profileUrl={influ?.profileUrl}
            desc={influ?.description}
          />
          {_renderContent()}
        </>
      ) : loading ? (
        <div style={styles.content}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={styles.content}>
          <Typography.Text>Nothing here</Typography.Text>
        </div>
      )}
    </div>
  );
};

export default InfluencerPublicListing;

const styles = createStyle({
  container: {
    background: COLORS.PLACEBO_BLUE,
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
  emptyIcon: {
    width: "140px",
    height: "140px",
  },
  emptyIconSmall: {
    width: "70px",
    height: "70px",
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
