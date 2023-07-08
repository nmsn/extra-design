import React, { FC, useEffect, useRef } from "react";

import { Cascader, DatePicker, Input, Select, TreeSelect } from "antd";
import classNames from "classnames";
import dayjs from "dayjs";

const className = "extra-design__search-component";

const dropdownClassName = `${className}--dropdown`;

interface NodeContainerProps {
  itemKey: string;
  label: string | JSX.Element;
  width?: number;
  children: React.ReactNode;
}

type ReactText = number | string;

export const NodeContainer: FC<NodeContainerProps> = ({
  itemKey,
  label,
  children,
  width,
}) => {
  return (
    <div key={itemKey} className={`${className}--col`}>
      <div className={`${className}--col--title`}>{label}:</div>
      <div
        className={classNames({
          [`${className}--col--content`]: true,
        })}
        style={{ width }}
      >
        {children}
      </div>
    </div>
  );
};

interface InputItemProps {
  state: any;
  itemKey: string;
  placeholder?: string;
  changeState: (newState: any, callback?: () => void) => void;
  extraProps?: { [key: string]: any };
  onChange?: (param: any) => void;
  onSearch: () => void;
}

export const InputItem: FC<InputItemProps> = ({
  state,
  itemKey,
  placeholder,
  changeState,
  extraProps,
  onChange,
  onSearch,
}) => {
  const commonProps = {
    value: state[itemKey],
    allowClear: true,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const newState = {
        [itemKey]: value || undefined,
      };
      changeState(newState);
      if (onChange) onChange(value);
    },
    ...extraProps,
  };

  return <Input {...commonProps} onPressEnter={onSearch} />;
};

interface SelectItemProps {
  type: string;
  state: any;
  itemKey: string;
  placeholder?: string;
  getPopupContainer: (node?: HTMLElement) => HTMLElement;
  changeState: (newState: any, callback?: () => void) => void;
  extraProps?: { [key: string]: any };
  onChange?: (param: any) => void;
  onSearch?: (value: any) => void;
  onLoad?: (value: any) => void;
  alwaysOnLoad?: boolean;
  options: JSX.Element[];
  optionsData: React.ComponentProps<typeof Select>["options"];
}

export const SelectItem: FC<SelectItemProps> = ({
  type,
  placeholder,
  getPopupContainer,
  extraProps,
  state,
  itemKey,
  changeState,
  onChange,
  onSearch,
  onLoad,
  alwaysOnLoad,
  options,
  optionsData,
}) => {
  const isInit = useRef(true);

  const value = state[itemKey];
  const commonProps = {
    showArrow: true,
    dropdownClassName,
    placeholder,
    value,
    style: {
      width: "100%",
    },
    getPopupContainer,
    allowClear: true,
    showSearch: true,
    onSearch: onSearch || (() => {}),
    filterOption: (inputValue, option) => {
      const { label, children } = option;
      if (
        (children && children.includes(inputValue)) ||
        (label && label.includes(inputValue))
      ) {
        return true;
      }
      return false;
    },
    mode: (type === "multiple" ? "multiple" : undefined) as
      | "multiple"
      | "tags"
      | undefined,
    onChange: (value: string) => {
      const newState = {
        [itemKey]: value,
      };

      changeState(newState);
      if (onChange) onChange(value);
    },
    ...extraProps,
  };

  useEffect(() => {
    const currOptions = options || optionsData;
    if (
      (value || alwaysOnLoad) &&
      currOptions &&
      currOptions.length === 0 &&
      onLoad &&
      isInit.current
    ) {
      isInit.current = false;
      onLoad(value);
    }
  }, [alwaysOnLoad, onLoad, options, optionsData, value]);

  if (Array.isArray(optionsData) && optionsData?.length) {
    return <Select {...commonProps} options={optionsData} />;
  }

  return <Select {...commonProps}>{options}</Select>;
};

interface TreeSelectItemProps {
  type: string;
  state: any;
  itemKey: string;
  placeholder?: string;
  getPopupContainer: (node?: HTMLElement) => HTMLElement;
  changeState: (newState: any, callback?: () => void) => void;
  extraProps?: { [key: string]: any };
  onChange?: (param: any) => void;
  onSearch?: (value: any) => void;
  options: JSX.Element[];
  optionsData: React.ComponentProps<typeof TreeSelect>["treeData"];
}

export const TreeSelectItem: FC<TreeSelectItemProps> = ({
  type,
  placeholder,
  getPopupContainer,
  extraProps,
  state,
  itemKey,
  changeState,
  onChange,
  options,
  optionsData,
}) => {
  const commonProps = {
    showArrow: true,
    dropdownClassName,
    placeholder,
    value: state[itemKey],
    style: {
      width: "100%",
    },
    getPopupContainer,
    showSearch: true,
    allowClear: true,
    treeLine: { showLeafIcon: false },
    treeCheckable: type === "treeSelectMultiple",
    multiple: type === "treeSelectMultiple",
    onChange: (value: string) => {
      const newState = {
        [itemKey]: value,
      };
      changeState(newState);
      if (onChange) onChange(value);
    },
    ...extraProps,
  };

  if (Array.isArray(optionsData) && optionsData?.length) {
    return <TreeSelect {...commonProps} treeData={optionsData} />;
  }

  return <TreeSelect {...commonProps}>{options}</TreeSelect>;
};

interface RangeInputItemProps {
  state: any;
  itemKey: string;
  placeholders?: string[];
  changeState: (newState: any, callback?: () => void) => void;
  onChange?: (param: any) => void;
}

export const RangeInputItem: FC<RangeInputItemProps> = ({
  placeholders,
  state,
  itemKey,
  changeState,
  onChange,
}) => {
  return (
    <>
      <Input
        placeholder={placeholders ? placeholders[0] : ""}
        value={state[`${itemKey}Low`]}
        allowClear
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          const newState = {
            [`${itemKey}Low`]: value,
          };
          changeState(newState);
        }}
      />
      <div className={`${className}--col--content--segmentation`} />
      <Input
        placeholder={placeholders ? placeholders[1] : ""}
        value={state[`${itemKey}High`]}
        allowClear
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          const newState = {
            [`${itemKey}High`]: value,
          };
          changeState(newState);
          if (onChange) onChange(value);
        }}
      />
    </>
  );
};

interface CascaderItemProps {
  state: any;
  itemKey: string;
  placeholder?: string;
  getPopupContainer: (node?: HTMLElement) => HTMLElement;
  changeState: (newState: any, callback?: () => void) => void;
  extraProps?: { [key: string]: any };
  onChange?: (param: any) => void;
  onSearch?: (value: any) => void;
  cascaderOptionMap?: { [key: string]: any }[];
  displayRender?: (label: string[]) => string;
}

export const CascaderItem: FC<CascaderItemProps> = ({
  cascaderOptionMap,
  placeholder,
  getPopupContainer,
  state,
  itemKey,
  changeState,
  onSearch,
  displayRender,
  extraProps,
  onChange,
}) => {
  const commonProps = {
    dropdownClassName,
    options: cascaderOptionMap,
    placeholder,
    getPopupContainer,
    value: state[itemKey],
    style: {
      width: "100%",
    },
    showSearch: {
      matchInputWidth: false,
      filter: (inputValue, path) =>
        path.some((option) => {
          if (option && option.label && typeof option.label === "string") {
            return (
              option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
            );
          }
          return false;
        }),
    },
    onSearch: onSearch || (() => {}),
    displayRender,
    onChange: (value: ReactText[]) => {
      const newState = {
        [itemKey]: value,
      };
      changeState(newState);
      if (onChange) onChange(value);
    },
    ...extraProps,
  };

  return <Cascader {...commonProps} />;
};

interface DatePickItemProps {
  state: any;
  itemKey: string;
  placeholder?: string;
  getPopupContainer: (node?: HTMLElement) => HTMLElement;
  changeState: (newState: any, callback?: () => void) => void;
  extraProps?: { [key: string]: any };
  onChange?: (param: any) => void;
}

export const DatePickItem: FC<DatePickItemProps> = ({
  placeholder,
  getPopupContainer,
  state,
  itemKey,
  changeState,
  extraProps,
  onChange,
}) => {
  const commonProps = {
    style: { width: "100%" },
    placeholder,
    getPopupContainer,
    picker: "date",
    value: state[itemKey] ? dayjs(state[itemKey]) : undefined,
    dropdownClassName,
    onChange: (value) => {
      const newState = {
        [itemKey]: value,
      };
      changeState(newState);
      if (onChange) onChange(value);
    },
    ...extraProps,
  } as any;

  return <DatePicker {...commonProps} />;
};

interface MonthPickItemProps {
  state: any;
  itemKey: string;
  placeholder?: string;
  getPopupContainer: (node?: HTMLElement) => HTMLElement;
  changeState: (newState: any, callback?: () => void) => void;
  extraProps?: { [key: string]: any };
  onChange?: (param: any) => void;
}

export const MonthPickItem: FC<MonthPickItemProps> = ({
  placeholder,
  getPopupContainer,
  state,
  itemKey,
  changeState,
  extraProps,
  onChange,
}) => {
  const commonProps = {
    style: { width: "100%" },
    placeholder,
    getPopupContainer,
    value: state[itemKey] ? dayjs(state[itemKey]) : undefined,
    dropdownClassName,
    onChange: (value) => {
      const newState = {
        [itemKey]: value,
      };
      changeState(newState);
      if (onChange) onChange(value);
    },
    ...extraProps,
  } as any;

  return <DatePicker.MonthPicker {...commonProps} />;
};

interface RangePickerItemProps {
  state: any;
  itemKey: string;
  placeholders?: string[];
  getPopupContainer: (node?: HTMLElement) => HTMLElement;
  changeState: (newState: any, callback?: () => void) => void;
  extraProps?: { [key: string]: any };
  onChange?: (param: any) => void;
}

export const RangePickerItem: FC<RangePickerItemProps> = ({
  placeholders,
  getPopupContainer,
  state,
  itemKey,
  changeState,
  extraProps,
  onChange,
}) => {
  const commonProps = {
    style: { width: "100%" },
    placeholder: placeholders,
    getPopupContainer,
    value: Array.isArray(state[itemKey])
      ? state[itemKey].map((v) => (v ? dayjs(v) : v))
      : [],
    dropdownClassName,
    onChange: (value) => {
      const newState = {
        [itemKey]: value,
      };
      changeState(newState);
      if (onChange) onChange(value);
    },
    ...extraProps,
  } as any;

  return <DatePicker.RangePicker {...commonProps} />;
};
