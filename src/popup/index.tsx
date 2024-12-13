import { Avatar, Flex, Image, Modal, Space, Typography } from "antd";
import { useEffect, useState } from "react";
const { Title } = Typography;
type Props = {
  open: boolean;
  onClose: () => void;
};

const ProfilePopup: React.FC<Props> = ({ open, onClose }) => {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    _getProfile();
  }, []);

  const _getProfile = async () => {
    try {
      // const profile = await instagram.getMyMedia();
    } catch (err) {}
  };

  return (
    <Modal
      title="Modal 1000px width"
      centered
      open={open}
      onOk={onClose}
      onCancel={onClose}
      width={1000}
    >
      {/* <Flex gap="middle" vertical> */}
      <Flex>
        <Space size={48}>
          <Avatar src={"https://picsum.photos/200"} size={112} />
          <div>
            <Title level={4}>h4. Ant Design</Title>
            <Title level={5}>h4. Ant Design</Title>
          </div>
        </Space>
      </Flex>
      {/* </Flex> */}

      <Flex>
        {Array.from({ length: 4 }).map((item) => {
          return (
            <Image
              width={200}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          );
        })}
      </Flex>
      <p>some contents...</p>
      <p>some contents...</p>
    </Modal>
  );
};

export default ProfilePopup;
