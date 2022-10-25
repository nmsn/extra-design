import React from "react";

export interface StandardProps {
  /**
   * @description       Class name
   * @description.zh-CN 类名
   * @default           ''
   */
  className?: string;
  /**
   * @description       Style
   * @description.zh-CN 样式
   * @default           {}
   */
  style?: React.CSSProperties;
}

export declare namespace TypeAttributes {
  type color = "red" | "green" | "black" | "blue" | "yellow";
}
