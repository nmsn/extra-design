import * as React from "react";

import { StandardProps } from "../@types/common";

export interface HeadLineProps extends StandardProps {
  /**
   * @description       Extra area on the right
   * @description.zh-CN 右侧额外区域
   * @default
   */
  extra?: JSX.Element | JSX.Element[];
  /**
   * @description       Whether for details page
   * @description.zh-CN 是否为详情页
   * @default
   */
  isDetail?: boolean;
  /**
   * @description       Title
   * @description.zh-CN 标题
   * @default           ''
   */
  title?: string | JSX.Element;
  /**
   * @description       Step back and click on the method being called
   * @description.zh-CN 后退，点击调用的方法
   * @default
   */
  onBack?: () => void;
}

export type HeadLineContextProps = HeadLineProps;

declare const HeadLine: React.ComponentType<HeadLineProps>;

export default HeadLine;
