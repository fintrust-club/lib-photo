import React, { useMemo } from "react";
import { COLORS } from "src/config/typography";
import { createStyle } from "src/utils/style";

type Props = {
  style?: React.CSSProperties;
  children: React.ReactNode;
  size?: number;
  variant?: "bold" | "semibold" | "normal" | "medium";
  color?: string;
};

const FONT_WEIGHT_MAP = {
  bold: "700",
  semibold: "600",
  medium: "500",
  normal: "400",
};

const Text: React.FC<Props> = ({
  variant = "normal",
  size = 14,
  color = COLORS.TEXT.PRIMARY,
  style,
  children,
}) => {
  const _style = useMemo(() => {
    return {
      ...styles.default,
      ...style,
      fontSize: size,
      fontWeight: FONT_WEIGHT_MAP?.[variant],
      color: color,
    };
  }, [style, size, variant, color]);

  return <p style={_style}>{children}</p>;
};

export default Text;

const styles = createStyle({
  default: {
    padding: 0,
    margin: 0,
    fontWeight: "400",
  },
});
