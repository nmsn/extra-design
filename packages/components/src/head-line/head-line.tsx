import React, { useCallback } from "react";

import classNames from "classnames";

import { HeadLineProps } from "./head-line.d";

const HeadLine: React.FC<HeadLineProps> = ({
  className: wrapperClassName = "",
  style = {},
  title = "",
  isDetail,
  onBack,
  extra,
}) => {
  const className = "-ant__head-line";

  const goBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      history.back();
    }
  }, []);

  return (
    <div
      className={classNames({
        [className]: true,
        [wrapperClassName]: !!wrapperClassName,
      })}
      style={style}
    >
      <div className={`${className}--title`}>
        {isDetail && (
          <div className={`${className}--title--back`} onClick={goBack}>
            返回
          </div>
        )}
        {title}
      </div>
      <div>{extra}</div>
    </div>
  );
};

export default HeadLine;