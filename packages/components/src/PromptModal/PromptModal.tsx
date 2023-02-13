import "antd/es/modal/style/index";
import Modal from "antd/es/modal";
import { CloseCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";

import {
  ModalParams,
  OpenPromptModalFunction,
  XuiPromptModalConfigFunction,
  XuiPromptModalConfigFunctionProps,
  XuiPromptModalProps,
} from "./PromptModal.d";

let globalConfig: Partial<XuiPromptModalConfigFunctionProps> = {};

const getIcon = (icon?: ModalParams["icon"]) => {
  /** icon 为 warn 或未传入 */
  if (icon === "warning" || !icon) {
    return <ExclamationCircleFilled />;
  }

  if (icon === "error") {
    return <CloseCircleFilled style={{ color: "red" }} />;
  }

  return icon;
};

const openPromptModal: OpenPromptModalFunction = (props) => {
  const {
    icon: propsIcon,
    type,
    title,
    content,
    width,
    centered = false,
    zIndex,
    cancelText,
    okText,
    okTextForPrompt,
    okTextForConfirm,
    onOk,
    onCancel,
  } = {
    ...globalConfig,
    ...props,
  } as XuiPromptModalConfigFunctionProps;

  const icon = getIcon(propsIcon);

  if (type === "confirm") {
    Modal.confirm({
      icon,
      title,
      content,
      centered,
      width,
      zIndex,
      okText: okText || okTextForConfirm || "确定",
      cancelText: cancelText || "取消",
      onOk,
      onCancel,
    });
  } else {
    Modal.warn({
      icon,
      title,
      content,
      centered,
      width,
      okText: okText || okTextForPrompt || "知道了",
      onOk,
    });
  }
};

const config: XuiPromptModalConfigFunction = (
  props: Partial<XuiPromptModalConfigFunctionProps>
) => {
  globalConfig = {
    ...globalConfig,
    ...props,
  };
};

const XuiPromptModal = {} as XuiPromptModalProps;

XuiPromptModal.openPromptModal = openPromptModal;
XuiPromptModal.destroyAll = Modal.destroyAll;
XuiPromptModal.config = config;

export default XuiPromptModal;
