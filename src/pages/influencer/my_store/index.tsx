import React, { useEffect, useState } from "react";
import UserHeader from "src/components/user_header";
import { COLORS } from "src/config/typography";
import { createStyle } from "src/utils/style";
import ToaImage from "src/assets/pngs/toa.png";
import ChainImage from "src/assets/pngs/chain.png";
import { Button, Flex, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "src/hooks/account";
import { useInfLink } from "src/hooks/link";
import { EditTwoTone } from "@ant-design/icons";
import { STORE_LINK_PREFIX } from "src/config/constant";
import { LINK_ICONS } from "src/config/links";
import WebsiteIcon from "src/assets/pngs/website.png";
import { useProducts } from "src/hooks/products";
import ProductCard from "src/components/productCard";

const MyStore = () => {
  let location = useLocation();
  const [tab, setTab] = useState(location.state?.initialTab ?? "links");
  const account = useAccount();
  const products = useProducts();
  const navigate = useNavigate();
  const infLink = useInfLink();

  const isLinksTab = tab === "links";

  useEffect(() => {
    infLink.fetch();
    products.fetch();
  }, []);

  const _getIcon = (icon_type: string) => {
    return (
      LINK_ICONS?.find((item) => item?.key === icon_type)?.icon ?? WebsiteIcon
    );
  };

  const _findProducts = (_product?: any) => {
    // navigate("/home/find_product");
    navigate("/home/my_product", {
      state: {
        product: !!_product ? _product : null,
        edit: !!_product,
      },
    });
  };

  const _openLink = (link?: any) => {
    navigate("/home/link", {
      state: {
        link: !!link ? link : null,
        edit: !!link,
      },
    });
  };

  const _openProduct = (product: any) => {
    window.open(product?.link, "_blank");
  };

  const _renderLinksEmpty = () => (
    <div style={styles.content}>
      <img src={ChainImage} alt="box" style={styles.emptyIconSmall} />
      <Typography.Text style={styles.desc}>
        You haven’t added any links
      </Typography.Text>
      <Button
        type="primary"
        size="large"
        style={styles.cta}
        onClick={() => _openLink()}
      >
        Add Links
      </Button>
    </div>
  );

  const _renderStoreEmpty = () => (
    <div style={styles.content}>
      <img src={ToaImage} alt="box" style={styles.emptyIcon} />
      <Typography.Text style={styles.desc}>
        You can add affiliate products or your own store product links with
        their images. This helps your audience to view your collection of
        products easily
      </Typography.Text>
      <Typography.Link copyable>
        {STORE_LINK_PREFIX + account.user?.link ?? ""}
      </Typography.Link>
      <Button
        type="primary"
        size="large"
        style={styles.cta}
        onClick={() => _findProducts()}
      >
        Add Products
      </Button>
    </div>
  );

  const _renderLinks = () => (
    <Flex style={{ padding: "24px 20px" }} vertical flex={1}>
      <Flex vertical flex={1}>
        {infLink?.links?.map((_link) => (
          <div
            key={_link?.id}
            style={{
              marginBottom: "16px",
              backgroundColor: COLORS.WHITE,
              borderRadius: 12,
              padding: "16px",
            }}
          >
            <Flex justify="space-between" align="center" flex={1}>
              <img
                style={{ width: "30px", height: "30px" }}
                src={_getIcon(_link?.icon_type)}
                alt={_link?.icon_type}
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  margin: "0px 16px",
                }}
              >
                <div>
                  <Typography.Title level={5}>
                    {_link?.label ?? "-"}
                  </Typography.Title>
                  <Typography.Text
                    strong
                    style={{
                      fontSize: "12px",
                      color: COLORS.RETRO_BLUE,
                    }}
                  >
                    {_link?.link ?? "-"}
                  </Typography.Text>
                </div>
              </div>

              <div>
                <EditTwoTone onClick={() => _openLink(_link)} />
              </div>
            </Flex>
          </div>
        ))}
      </Flex>
      <Button
        type="primary"
        size="large"
        style={styles.cta}
        onClick={() => _openLink()}
      >
        Add Link
      </Button>
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
              onEdit={() => _findProducts(_link)}
              imagePath={_link?.imagePath}
              key={_link?.name + index}
              editable
            />
          ))}
        </div>
      </Flex>
      <Button
        type="primary"
        size="large"
        style={styles.cta}
        onClick={() => _findProducts()}
      >
        Add Products
      </Button>
    </Flex>
  );

  const _renderContent = () => {
    if (isLinksTab) {
      return infLink?.links?.length ? _renderLinks() : _renderLinksEmpty();
    } else {
      return products?.products?.length
        ? _renderProducts()
        : _renderStoreEmpty();
    }
  };

  return (
    <div style={styles.container}>
      <UserHeader
        onChangeTab={(tab: string) => setTab(tab)}
        selectedTab={tab}
      />
      {_renderContent()}
    </div>
  );
};

export default MyStore;

const styles = createStyle({
  container: {
    background: COLORS.PLACEBO_BLUE,
    display: "flex",
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
