import React from "react";
import { COLORS } from "src/config/typography";
import Text from "src/elements/typography";
import { useStorateUrl } from "src/hooks/image";
import { EditTwoTone } from "@ant-design/icons";

type Props = {
  title: string;
  link: string;
  imagePath: string;
  style?: React.CSSProperties;
  editable?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
};

const ProductCard = ({
  title,
  link,
  imagePath,
  style = {},
  editable,
  onClick,
  onEdit,
}: Props) => {
  const image = useStorateUrl(imagePath);

  return (
    <div
      style={{
        marginBottom: "16px",
        backgroundColor: COLORS.WHITE,
        backgroundImage: image.fetching ? undefined : `url(${image?.url})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        borderRadius: 12,
        overflow: "hidden",
        flex: 1,
        minWidth: "40%",
        height: "220px",
        ...style,
      }}
      onClick={!editable ? onClick : undefined}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(217, 217, 217, 0) 0%, #141A28 100%)",
          padding: "16px",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Text
            variant="medium"
            size={14}
            color={COLORS.WHITE}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title ?? "-"}
          </Text>
          <Text
            size={12}
            color={COLORS.RETRO_BLUE}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {link ?? "-"}
          </Text>
        </div>

        {editable && (
          <div
            style={{
              padding: "8px",
            }}
            onClick={onEdit}
          >
            <EditTwoTone style={{ marginLeft: "8px", width: "20px" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
