import React from "react";

import classnames from "classnames";
import { ExclamationCircleFilled } from "@ant-design/icons";

type WarningAlertProps = {
  type?: "warning" | "error";
  icon?: React.ReactNode | boolean;
  style?: React.CSSProperties;
} & ({ text: React.ReactNode } | { children: React.ReactNode });

const className = "extra-design__warning-alert";

const WarningAlert = ({
  type = "warning",
  icon = true,
  style,
  ...contentProps
}: WarningAlertProps) => {
  let content: React.ReactNode = "";
  if ("children" in contentProps) {
    content = contentProps?.children;
  } else {
    content = contentProps?.text;
  }

  return (
    <div
      className={classnames({
        [`${className}`]: true,
        [`${className}--tip`]: true,
        [`${className}--${type}`]: true,
      })}
      style={style}
    >
      {(() => {
        if (typeof icon === "boolean") {
          return icon
            ? ((<ExclamationCircleFilled />) as React.ReactNode)
            : null;
        }
        return icon;
      })()}
      {content}
    </div>
  );
};

export default WarningAlert;
