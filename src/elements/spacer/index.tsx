import React, { useMemo } from "react";

type Props = {
  children?: React.ReactNode;

  /** margin,padding: top,bottom,left,right  P0 if present*/
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;

  /** margin,padding: horizontal,vertical   P1 if present*/
  mh?: number;
  mv?: number;
  ph?: number;
  pv?: number;

  /** margin, padding   P2 if present*/
  m?: number;
  p?: number;

  dir?: "column" | "row";
  align?: "center" | "flex-start" | "flex-end";
  justify?: "center" | "flex-start" | "flex-end";

  style?: React.CSSProperties;
};

const Spacer: React.FC<Props> = ({
  children,
  m = 0,
  p = 0,
  mh = 0,
  ph = 0,
  mv = 0,
  pv = 0,
  ml = 0,
  mr = 0,
  mt = 0,
  mb = 0,
  pl = 0,
  pr = 0,
  pt = 0,
  pb = 0,
  dir = "column",
  justify = "flex-start",
  align = "flex-start",
  style = {},
}) => {
  const _style = useMemo((): React.CSSProperties => {
    let result: React.CSSProperties = {
      margin: m,
      padding: p,
      display: "flex",
      flexDirection: dir,
      alignItems: align,
      justifyContent: justify,
      ...style,
    };

    if (ml || mr || mt || mb) {
      result.margin = `${mt}px ${mr}px ${mb}px ${ml}px`;
    } else if (mh || mv) {
      result.margin = `${mv}px ${mh}px`;
    }

    if (pl || pr || pt || pb) {
      result.padding = `${pt}px ${pr}px ${pb}px ${pl}px`;
    } else if (ph || pv) {
      result.padding = `${pv}px ${ph}px`;
    }

    return result;
  }, [
    m,
    p,
    mh,
    ph,
    mv,
    pv,
    ml,
    mr,
    mt,
    mb,
    pl,
    pr,
    pt,
    pb,
    dir,
    justify,
    align,
    style,
  ]);

  return <div style={_style}>{children}</div>;
};

export default Spacer;
