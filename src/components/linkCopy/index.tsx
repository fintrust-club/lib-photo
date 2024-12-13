import { Typography, message } from "antd";
import React from "react";
import { createStyle } from "src/utils/style";
import { CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "src/utils/text";

type Props = {
  link: string;
};
const LinkCopy = ({ link }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();

  const _copy = async () => {
    try {
      await copyToClipboard(link);
      messageApi.open({
        type: "success",
        content: "Copied to clipboard",
      });
    } catch (err: any) {
      messageApi.open({
        type: "error",
        content: err?.message,
      });
    }
  };

  return (
    <div onClick={_copy}>
      {contextHolder}
      <Typography.Link
      //   href="https://store.buzbridge/username"
      //   target="_blank"
      >
        {link}
      </Typography.Link>
      <CopyOutlined style={styles.copyIcon} />
    </div>
  );
};

export default LinkCopy;

const styles = createStyle({
  copyIcon: {
    marginLeft: "8px",
  },
});
