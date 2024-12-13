import { Avatar, Button, Flex, Form, Input, Switch, Typography } from "antd";
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LINK_ICONS } from "src/config/links";
import { COLORS } from "src/config/typography";
import { useInfLink } from "src/hooks/link";
import { createWhatsappLink } from "src/utils/code";
import { createStyle } from "src/utils/style";

const LinkDetail = () => {
  const navigate = useNavigate();
  let location = useLocation();
  const infLink = useInfLink();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState(false);

  const isEdit = !!location.state?.edit;
  const _oldLink = location.state?.link as any;

  const link_icons = useMemo(() => {
    return showMore ? LINK_ICONS : LINK_ICONS.slice(0, 6);
  }, [showMore]);

  const _saveLink = async (data: any) => {
    setLoading(true);
    await infLink.save(
      {
        id: _oldLink?.id,
        label: data.link_title,
        value: data.nav_link,
        icon_type: data.link_icon,
      },
      isEdit
    );
    navigate(-1);
    setLoading(false);
  };

  const _delete = async () => {
    setDeleting(true);
    await infLink.delete(_oldLink?.id);
    navigate(-1);
    setDeleting(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Typography.Title level={3}>
          {isEdit ? "Edit link" : "Add new link"}{" "}
        </Typography.Title>
      </div>
      <div style={styles.content}>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 600, marginTop: "24px" }}
          onFinish={_saveLink}
        >
          <Form.Item
            name="link_title"
            label="Link title"
            rules={[{ required: true, message: "This is required" }]}
            initialValue={isEdit ? _oldLink?.label : ""}
          >
            <Input size="large" />
          </Form.Item>

          <div
            style={
              whatsappLink
                ? {
                    background: COLORS.WHITE,
                    padding: "20px 10px 10px 10px",
                    borderRadius: "12px",
                  }
                : undefined
            }
          >
            <Form.Item
              label="Navigation link"
              name="nav_link"
              rules={[
                { required: true, message: "This is required" },
                { type: "url", message: "Url is not valid" },
              ]}
              initialValue={isEdit ? _oldLink?.link : ""}
            >
              <Input size="large" />
            </Form.Item>

            <Flex align="center">
              <Typography.Text strong style={{ color: "#407BFF" }}>
                ADD WHATSAPP LINK
              </Typography.Text>
              <Switch
                size="small"
                value={whatsappLink}
                style={{ marginLeft: "16px" }}
                onChange={setWhatsappLink}
              />
            </Flex>

            {whatsappLink && (
              <>
                <Typography.Text
                  style={{ fontSize: "10px", marginTop: "12px" }}
                >
                  You can add your Whatsapp number below, we will automatically
                  generate your Whatsapp link and add it to your redirection
                </Typography.Text>

                <Form.Item
                  label="Mobile number"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "This is required",
                    },
                  ]}
                  style={{ marginTop: "24px" }}
                >
                  <Input
                    prefix="+91"
                    size="large"
                    maxLength={10}
                    onChange={(event) => {
                      form.setFieldsValue({
                        nav_link: createWhatsappLink(event?.target?.value),
                      });
                    }}
                  />
                </Form.Item>
              </>
            )}
          </div>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.link_icon !== currentValues.link_icon
            }
          >
            {({ getFieldValue }: { getFieldValue: (field: string) => any }) => (
              <Form.Item
                label="What type of link is this?"
                name="link_icon"
                rules={[{ required: true, message: "This is required" }]}
                style={{ marginTop: "20px" }}
              >
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                >
                  {link_icons.map((icon) => {
                    const isSelected = getFieldValue("link_icon") === icon.key;
                    return (
                      <div
                        style={{
                          padding: "6px 12px 6px 12px",
                          backgroundColor: COLORS.WHITE,
                          borderRadius: 8,
                          marginBottom: "12px",
                          marginRight: "12px",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)",
                          borderColor: isSelected
                            ? COLORS.LIGHTISH_BLUE
                            : COLORS.WHITE,
                        }}
                        onClick={() => {
                          form.setFieldsValue({
                            link_icon: icon.key,
                          });
                        }}
                      >
                        <Avatar
                          src={
                            <img
                              src={icon.icon}
                              alt={icon.label?.toLowerCase()}
                            />
                          }
                        />
                        <Typography.Text style={{ marginLeft: 8 }}>
                          {icon.label}
                        </Typography.Text>
                      </div>
                    );
                  })}
                  <Button
                    type="link"
                    onClick={() => setShowMore((pre) => !pre)}
                  >
                    {showMore ? "Show less" : "Show more"}
                  </Button>
                </div>
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item>
            <Flex flex={1}>
              <Flex flex={1}>
                {isEdit ? (
                  <Button
                    style={{ marginTop: "32px" }}
                    type="default"
                    block
                    size="large"
                    danger
                    loading={deleting}
                    onClick={_delete}
                  >
                    {"Delete"}
                  </Button>
                ) : (
                  <div></div>
                )}
              </Flex>
              <Flex flex={1} style={{ marginLeft: "16px" }}>
                <Button
                  style={{ marginTop: "32px" }}
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                >
                  {isEdit ? "Update" : "Add link"}
                </Button>
              </Flex>
            </Flex>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LinkDetail;

const styles = createStyle({
  container: {
    background: COLORS.PLACEBO_BLUE,
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  header: {
    background: COLORS.WHITE,
    padding: "40px 20px 20px 20px",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "30px",
  },
  emptyIcon: {
    width: "140px",
    height: "140px",
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
