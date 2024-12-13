import React, { useEffect, useState } from "react";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Typography, Upload, message } from "antd";
import type { GetProp, UploadProps } from "antd";
import { useAccount } from "src/hooks/account";
import { useNavigate } from "react-router-dom";
import { fb } from "src/core/firebase/setup";
import { RemoteImageManager } from "src/core/firebase/image";

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

const EditProfile = () => {
  const navigate = useNavigate();
  const account = useAccount();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [desc, setDesc] = useState<string>("");

  useEffect(() => {
    if (!file) return;
    getBase64(file, (base64) => setImageUrl(base64));
  }, [file]);

  useEffect(() => {
    if (account?.user?.profileUrl) {
      setLoading(true);

      RemoteImageManager.getUrl(account?.user?.profileUrl).then((url) => {
        setImageUrl(url ?? null);
        setLoading(false);
      });
    }
  }, [account?.user?.profileUrl]);

  useEffect(() => {
    setDesc(account?.user?.description ?? "");
  }, [account?.user?.description]);

  const _save = async () => {
    setLoading(true);

    let downloadUrlPath = account?.user?.profileUrl ?? null;

    if (file) {
      downloadUrlPath = await fb.upload(file, `profile/${crypto.randomUUID()}`);

      if (account?.user?.profileUrl) {
        await fb.deleteFile(account?.user?.profileUrl);
      }
    }

    await account.profile.update({
      profileUrl: downloadUrlPath,
      description: desc,
    });

    setLoading(false);
    navigate(-1);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <div style={{ alignSelf: "flex-end" }} onClick={() => navigate(-1)}>
        <CloseOutlined />
      </div>
      <div style={{ marginTop: "40px" }}>
        <Upload
          // name="avatar"
          listType="picture-circle"
          // className="avatar-uploader"
          showUploadList={false}
          // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          beforeUpload={beforeUpload}
          // onChange={handleChange}
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
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 500,
              }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </div>

      <Typography.Text style={{ alignSelf: "flex-start" }}>
        Description
      </Typography.Text>
      <Input.TextArea
        rows={4}
        onChange={(e) => {
          setDesc(e.target.value);
        }}
        value={desc}
      />
      <Flex flex={1} style={{ alignSelf: "stretch" }}>
        <Flex flex={1}>
          <div></div>
        </Flex>
        <Flex flex={1} style={{ marginLeft: "16px" }}>
          <Button
            style={{ marginTop: "32px" }}
            type="primary"
            block
            size="large"
            loading={loading}
            onClick={_save}
          >
            {"Save"}
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default EditProfile;
