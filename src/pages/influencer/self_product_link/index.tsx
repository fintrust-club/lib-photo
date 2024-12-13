import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Upload, message } from "antd";
import type { GetProp, UploadProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Text from "src/elements/typography";
import { createStyle } from "src/utils/style";
import { useProducts } from "src/hooks/products";
import { FOLDERS, RemoteImageManager } from "src/core/firebase/image";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    message.error("Image must smaller than 10MB!");
  }
  return isJpgOrPng && isLt2M;
};

const MyProduct = () => {
  const [form] = Form.useForm();
  let location = useLocation();
  let isEdit = location.state?.edit ?? false;
  let oldProduct = location.state?.product ?? null;

  const navigate = useNavigate();
  const products = useProducts();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<{
    url: string | null;
    uploaded: boolean;
  }>({ url: null, uploaded: false });

  useEffect(() => {
    if (isEdit && oldProduct?.imagePath) {
      RemoteImageManager.getUrl(oldProduct?.imagePath).then((url: string) => {
        setImageUrl({ url, uploaded: true });
        const file = {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: url,
        };
        form.setFieldsValue({
          image: { file: file },
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!file) return;
    getBase64(file, (base64) => setImageUrl({ url: base64, uploaded: false }));
  }, [file]);

  const _save = async (formData: any) => {
    try {
      setLoading(true);
      const { name, link, price, image } = formData ?? {};

      let _uploadedImage = oldProduct?.imagePath;
      if (image?.file?.status !== "done") {
        _uploadedImage = await RemoteImageManager.upload(
          FOLDERS.PRODUCT,
          image?.file?.originFileObj
        );
        if (oldProduct?.imagePath) {
          await RemoteImageManager.delete(oldProduct?.imagePath);
        }
      }

      if (!_uploadedImage) throw new Error("Image upload failed, try again");

      await products.save({
        id: oldProduct?.id,
        name,
        link,
        price,
        imagePath: _uploadedImage,
      });
      navigate("/home", {
        replace: true,
        state: {
          initialTab: "store",
        },
      });
    } catch (err: any) {
      message.error(err?.message ?? "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const _delete = async () => {
    setDeleting(true);
    await products.delete(oldProduct?.id);
    navigate("/home", {
      replace: true,
      state: {
        initialTab: "store",
      },
    });
    setDeleting(false);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div style={styles.screen}>
      <Flex style={styles.header} justify={"space-between"} align={"center"}>
        <Text size={20} variant="semibold">
          {isEdit ? "Edit product" : "Add new product"}
        </Text>
      </Flex>
      <div style={styles.content}>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 600, marginTop: "24px" }}
          onFinish={_save}
        >
          <Form.Item
            name="name"
            label="Product name"
            rules={[{ required: true, message: "This is required" }]}
            initialValue={oldProduct?.name}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="link"
            label="Product Link"
            rules={[{ required: true, message: "This is required" }]}
            initialValue={oldProduct?.link}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Product Price (Optional)"
            rules={[{ required: false }]}
            initialValue={oldProduct?.price}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Product Image"
            rules={[{ required: true }]}
            valuePropName="data"
          >
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              multiple={false}
              customRequest={async (options) => {
                // setLoading(true);
                // setImageUrl(null);

                // const downloadUrlPath = await fb.upload(
                //   options.file,
                //   `profile/${options?.filename}-${crypto.randomUUID()}`
                // );

                // if (account?.user?.profileUrl) {
                //   await fb.deleteFile(account?.user?.profileUrl);
                // }

                // await account.profile.update({
                //   profileUrl: downloadUrlPath,
                // });

                // setLoading(false);
                setFile(options.file);
              }}
            >
              {imageUrl?.url ? (
                <img
                  src={imageUrl?.url}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Flex flex={1}>
              <Flex flex={1}>
                {isEdit ? (
                  <Button
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
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                >
                  {isEdit ? "Update" : "Add Product"}
                </Button>
              </Flex>
            </Flex>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default MyProduct;

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
