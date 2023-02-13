import React from "react";

import { Space } from "antd";

const FirstBtnWithPrimary = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const arr = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child);
    }

    return child;
  })?.filter(Boolean) as { props: any; type: any; key: any }[];

  const filterArr = arr?.filter(
    (item) =>
      (item?.props?.accessible && !!item?.props?.accessible) ||
      item?.props?.accessible === undefined
  );

  const result = filterArr?.map((item, index) => {
    if (item?.type?.displayName === "Button") {
      return React.cloneElement(item, {
        type: index === 0 ? "primary" : "default",
        key: +index,
      });
    }

    if (item?.props?.accessible === true) {
      return React.cloneElement(item?.props?.children, {
        type: index === 0 ? "primary" : "default",
        key: +index,
      });
    }

    return null;
  });

  return <Space>{result}</Space>;
};

export default FirstBtnWithPrimary;
