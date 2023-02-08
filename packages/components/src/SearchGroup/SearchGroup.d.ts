import React from "react";

import { Dayjs } from "dayjs";

import { StandardProps } from "../@types/common";

export interface SearchComponentHandles {
  /** 清除筛选项 */
  clear: () => void;
  /** 清空指定项 */
  resetState: (paramNameList: string[]) => void;
}

export type NodeItemType =
  | "input"
  | "select"
  | "treeSelect"
  | "treeSelectMultiple"
  | "multiple"
  | "rangeInput"
  | "cascader"
  | "datePicker"
  | "monthPicker"
  | "rangePicker";

export interface NodeType {
  key: string;
  /**
   * @description
   * input <br/>
   * select <br/>
   * treeSelect <br/>
   * treeSelectMultiple <br/>
   * multiple <br/>
   * rangeInput <br/>
   * cascader <br/>
   * datePicker <br/>
   * rangePicker
   * @description.zh-CN
   * input 输入框 <br/>
   * select 下拉框 <br/>
   * treeSelect 树状选择 <br/>
   * treeSelectMultiple 树状选择复选 <br/>
   * multiple 下拉复选框 <br/>
   * rangeInput 范围输入框 <br/>
   * cascader 级联选择器 <br/>
   * datePicker 日期选择 <br/>
   * rangePicker 日期范围选择
   * @default
   */
  type: NodeItemType;
  /**
   * @description       Is hidden
   * @description.zh-CN 是否隐藏
   * @default
   */
  hidden?: boolean;
  /**
   * @description       name
   * @description.zh-CN 名称
   * @default
   */
  label: string;
  /**
   * @description       questionTooltip
   * @description.zh-CN label提示
   * @default
   */
  questionTooltip?: string;
  /**
   * @description       The clues
   * @description.zh-CN 提示语
   * @default
   */
  placeholder?: string;
  /**
   * @description       The clues group
   * @description.zh-CN 提示语组
   * @default
   */
  placeholders?: [string, string];
  /**
   * @description       Select options
   * @description.zh-CN 下拉框选项
   * @default
   */
  options?: JSX.Element[];
  /**
   * @description       Select options data
   * @description.zh-CN 下拉框选项
   * @default
   */
  optionsData?: any[];
  /**
   * @description       Control the width
   * @description.zh-CN 控件宽度
   * @default
   */
  width?: number;
  /**
   * @description       Extra props
   * @description.zh-CN 额外属性
   * @default
   */
  /** 额外属性 */
  extraProps?: { [key: string]: any };
  /**
   * @description       Cascader options，see：<a target="__blank" href="https://ant-design.gitee.io/components/cascader-cn/#API">CascaderOptionType</a>
   * @description.zh-CN 级联选项，详见：<a target="__blank" href="https://ant-design.gitee.io/components/cascader-cn/#API">CascaderOptionType</a>
   * @default
   */
  cascaderOptionMap?: { [key: string]: any }[];
  /**
   * @description       Always fires when the component is first loaded, regardless of whether there is a default value
   * @description.zh-CN 总是在组件初次加载时触发，不论是否有默认值
   * @default
   */
  alwaysOnLoad?: boolean;
  /**
   * @description       Valida function
   * @description.zh-CN 校验方法
   * @default
   */
  validator?: (param: { [key: string]: any }) => boolean;
  /**
   * @description       Float block renders the target DOM
   * @description.zh-CN 浮块渲染的目标DOM
   * @default
   */
  getPopupContainer?: (node?: HTMLElement) => HTMLElement;
  /**
   * @description       Cascader is optional, and the input box displays custom content
   * @description.zh-CN cascader可选， 输入框展示内容自定义
   * @default
   */
  displayRender?: (label: string[]) => string;
  /**
   * @description       Select is required for multi-level selection linkage
   * @description.zh-CN select多级选择联动时需要
   * @default
   */
  onChange?: (param: any) => void;
  /**
   * @description       Select, Cascader have this property
   * @description.zh-CN select、cascader有此属性
   * @default
   */
  onSearch?: (value: any) => void;
  /**
   * @description       When a component is first loaded, it fires only when there is a default value
   * @description.zh-CN 组件初次加载时，仅在有默认值时触发
   * @default
   */
  onLoad?: (value: any) => void;
}

/** 查询时抛出来的参数类型 */
export type SearchComponentCallbackParamsType =
  | React.ReactText
  | React.ReactText[]
  | Dayjs
  | Dayjs[]
  | { [key: string]: any };

export interface ValidatorMapType {
  [key: string]: (value: any) => boolean;
}

export interface SearchComponentProps extends StandardProps {
  /**
   * @description       Filter item configuration，see：<a href="#api-nodetype">NodeType</a>
   * @description.zh-CN 筛选项配置，详见：<a href="#api-nodetype">NodeType</a>
   * @default
   */
  searchNode: NodeType[];
  /**
   * @description       Filter button extra
   * @description.zh-CN 筛选额外按钮
   * @default
   */
  searchExtraContent?: JSX.Element | JSX.Element[];
  /**
   * @description       Default value
   * @description.zh-CN 默认值
   * @default
   */
  defaultValues?: { [key: string]: any };
  /**
   * @description       To trigger the filter event, click "Query" and "Reset"
   * @description.zh-CN 触发筛选事件，点击“查询”、“重置”
   * @default
   */
  onSearch: (values: { [key: string]: any }, type: "search" | "reset") => void;
  /**
   * @description       Hide Reset button, not hidden to false by default
   * @description.zh-CN 隐藏重置按钮,默认不隐藏为false
   * @default
   */
  hideResetButton?: boolean;
}

declare const XuiSearchComponent: React.ComponentType<SearchComponentProps>;

export default XuiSearchComponent;
