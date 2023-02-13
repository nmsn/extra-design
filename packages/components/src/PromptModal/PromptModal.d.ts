export interface ModalParams {
  /**
   * @description       Icon
   * @description.zh-CN 图标
   * @default
   */
  icon?: 'warning' | 'error' | JSX.Element;
  /**
   * @description       Title
   * @description.zh-CN 标题
   * @default
   */
  title?: React.ReactText | JSX.Element;
  /**
   * @description       Tip text
   * @description.zh-CN 提示文字
   * @default
   */
  content?: React.ReactText | JSX.Element;
  /**
   * @description       Whether vertically centered
   * @description.zh-CN 是否垂直居中
   * @default
   */
  centered?: boolean;
  /**
   * @description       Hierarchy weighting
   * @description.zh-CN 层级权重
   * @default
   */
  zIndex?: number;
}

export interface ConfirmModalParams extends ModalParams {
  /**
   * @description       Type 'confirm'
   * @description.zh-CN 类型 'confirm'
   * @default
   */
  type: 'confirm';
  /**
   * @description       Modal width
   * @description.zh-CN 弹窗宽度
   * @default
   */
  width?: string | number;
  /**
   * @description       Confirm button text
   * @description.zh-CN 确认按钮文字
   * @default           '确定'
   */
  okText?: React.ReactText;
  /**
   * @description       Cancel button text
   * @description.zh-CN 取消按钮文字
   * @default           '取消'
   */
  cancelText?: React.ReactText;
  /**
   * @description       Confirm button triggers event
   * @description.zh-CN 确认按钮触发事件
   * @default
   */
  onOk: () => void;
  /**
   * @description       Cancel button triggers event
   * @description.zh-CN 取消按钮触发事件
   * @default
   */
  onCancel?: () => void;
}

export interface PromptModalParams extends ModalParams {
  /**
   * @description       Type 'prompt'
   * @description.zh-CN 类型 'prompt'
   * @default
   */
  type: 'prompt';
  /**
   * @description       Modal width
   * @description.zh-CN 弹窗宽度
   * @default
   */
  width?: string | number;
  /**
   * @description       Confirm button text
   * @description.zh-CN 确认按钮文字
   * @default           '确定'
   */
  okText?: React.ReactText;
  /**
   * @description       Confirm button triggers event
   * @description.zh-CN 确认按钮触发事件
   * @default
   */
  onOk?: () => void;
}

export type FinallModalParams = ConfirmModalParams | PromptModalParams;

export interface OpenPromptModalFunction {
  (params: FinallModalParams): void;
}

export interface XuiPromptModalConfigFunctionProps extends ConfirmModalParams {
  /**
   * @description       Type prompt | confirm
   * @description.zh-CN 类型 prompt 或 confirm
   * @default
   */
  type: 'prompt' | 'confirm';
  /**
   * @description       Confirm button text(prompt)
   * @description.zh-CN 确认按钮文字(prompt)
   * @default           '知道了'
   */
  okTextForPrompt?: React.ReactText;
  /**
   * @description       Confirm button text(confirm)
   * @description.zh-CN 确认按钮文字(confirm)
   * @default           '确定'
   */
  okTextForConfirm?: React.ReactText;
}

export interface XuiPromptModalConfigFunction {
  (props: Partial<XuiPromptModalConfigFunctionProps>): void;
}

export interface XuiPromptModalProps {
  /**
   * @description       Triggers the open popover function，see：<a href="#api-finallmodalparams">OpenPromptModalFunction</a>
   * @description.zh-CN 触发打开弹窗函数，接收参数为对象，类型详见：<a href="#api-finallmodalparams">FinallModalParams</a>
   * @default
   */
  openPromptModal: OpenPromptModalFunction;
  /**
   * @description       Destroy all popovers
   * @description.zh-CN 销毁所有弹窗
   * @default
   */
  destroyAll: () => void;
  /**
   * @description       Global config
   * @description.zh-CN 全局配置
   * @default
   */
  config: XuiPromptModalConfigFunction;
}

declare const XuiPromptModal: XuiPromptModalProps;

export default XuiPromptModal;
