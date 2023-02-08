import React, {
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import "antd/es/button/style/index";
import "antd/es/tooltip/style/index";
import Button from "antd/es/button";
import ConfigProvider from "antd/es/config-provider";
import locale from "antd/es/locale/zh_CN";
import Tooltip from "antd/es/tooltip";
import classNames from "classnames";

import {
  CascaderItem,
  DatePickItem,
  InputItem,
  MonthPickItem,
  NodeContainer,
  RangeInputItem,
  RangePickerItem,
  SelectItem,
  TreeSelectItem,
} from "./Item";
import {
  NodeType,
  SearchComponentHandles,
  SearchComponentProps,
  ValidatorMapType,
} from "./SearchGroup.d";

const isObj = (val: unknown): val is { [key: string]: any } => {
  return Object.prototype.toString.call(val) === "[object Object]";
};

const className = "extra-design__search-component";
const dropdownClassName = `${className}--dropdown`;

const isValidKey = (innerKeys: string[], itemKey: string) =>
  innerKeys.includes(itemKey) ||
  (itemKey.includes("Low") && innerKeys.includes(itemKey.replace("Low", ""))) ||
  (itemKey.includes("High") && innerKeys.includes(itemKey.replace("High", "")));

const isValidData = (val: any) => {
  return (
    (Array.isArray(val) && val.length) ||
    (isObj(val) && Object.keys(val).length) ||
    val ||
    val === 0
  );
};

const formatSearchParams = (params: { [key: string]: any }) => {
  const resultParams = {};

  Object.keys(params).forEach((key) => {
    const val = params[key];
    if (isValidData(val)) {
      resultParams[key] = val;
    }
  });

  return resultParams;
};

const createChangedSearchState = (
  currentState: { [key: string]: any },
  keys: string[]
) => {
  const changedState = {};
  keys.forEach((key) => {
    const value = currentState[key];
    if (isValidData(value)) {
      changedState[key] = value;
    } else {
      changedState[key] = undefined;
    }
  });
  return changedState;
};

const XuiSearchComponent: ForwardRefRenderFunction<
  SearchComponentHandles,
  SearchComponentProps
> = (
  {
    searchNode,
    searchExtraContent,
    onSearch,
    defaultValues,
    hideResetButton = false,
  },
  ref
) => {
  /** 渲染的数据 */
  const [state, setState] = useState({} as any);
  /** 真正筛选的数据 */
  const [searchState, setSearchState] = useState({} as any);
  /** 外部input焦点控制 */
  const [visible, setVisible] = useState(false);

  const searchComponentEl = useRef(null);
  const searchComponentBtnRef = useRef<HTMLElement>(null);

  /** 获取校验集 */
  const validatorMap = useMemo(() => {
    const outerValidatorMap: ValidatorMapType = {};
    const innerValidatorMap: ValidatorMapType = {};
    searchNode.forEach((node: NodeType) => {
      const { key, hidden, validator } = node;
      if (validator) {
        if (hidden) {
          innerValidatorMap[key] = validator;
        } else {
          outerValidatorMap[key] = validator;
        }
      }
    });
    return {
      outerValidatorMap,
      innerValidatorMap,
    };
  }, [searchNode]);

  /** 解析外部keys，内部keys */
  const analysis = useMemo(() => {
    const outerKeys: string[] = [];
    const innerKeys: string[] = [];
    const rangeKeys: string[] = [];
    searchNode.forEach((node: NodeType) => {
      const { key, type, hidden } = node;
      if (hidden) {
        innerKeys.push(key);
      } else {
        outerKeys.push(key);
      }
      // rangeInput 只能出现在 inner 中
      if (type === "rangeInput") {
        rangeKeys.push(`${key}Low`);
        rangeKeys.push(`${key}High`);
      }
    });
    return {
      outerKeys,
      innerKeys,
      rangeKeys,
    };
  }, [searchNode]);

  /** 改变渲染的数据 */
  const changeState = useCallback((newState: any, callback?: () => void) => {
    setState((state) => ({ ...state, ...newState }));
    callback?.();
  }, []);

  const changeVisible = useCallback(
    (newVisible: boolean) => {
      if (newVisible) {
        setState(searchState);
      }
      setVisible(newVisible);
    },
    [searchState]
  );

  /** 获取校验参数 */
  const createValidatorParams = useCallback(
    (currentState: { [key: string]: any }, currentKey: string) => {
      const callbackParam: { [key: string]: any } = {};

      if (analysis.rangeKeys.includes(`${currentKey}Low`)) {
        callbackParam[`${currentKey}Low`] = currentState[`${currentKey}Low`];
        callbackParam[`${currentKey}High`] = currentState[`${currentKey}High`];
      } else {
        callbackParam[currentKey] = currentState[currentKey];
      }

      return callbackParam;
    },
    [analysis.rangeKeys]
  );

  /** 校验内部参数 */
  const validatorKeys = useCallback(
    (currentState: { [key: string]: any }) => {
      const validatorEntries = Object.entries({
        ...validatorMap.outerValidatorMap,
        ...validatorMap.innerValidatorMap,
      });
      const hasValidatorFail = !validatorEntries.some(([key, validator]) => {
        if (validator) {
          const callbackParam = createValidatorParams(currentState, key);
          return validator(callbackParam) === false;
        }
        return false;
      });
      return hasValidatorFail;
    },
    [createValidatorParams, validatorMap]
  );

  /** 查找 */
  const search = useCallback(() => {
    const currentState = { ...state };
    const flag = validatorKeys(currentState);
    if (!flag) {
      return;
    }

    const { innerKeys, outerKeys, rangeKeys } = analysis;
    const allAnalysis = [...innerKeys, ...outerKeys, ...rangeKeys];
    const keys = Object.keys(currentState).filter((itemKey) =>
      isValidKey(allAnalysis, itemKey)
    );
    const changedState = createChangedSearchState(currentState, keys);

    const newSearchState = { ...searchState, ...changedState };
    const resultParams = formatSearchParams(newSearchState);

    setSearchState(resultParams);
    onSearch(resultParams, "search");
    changeVisible(false);
  }, [analysis, changeVisible, onSearch, searchState, state, validatorKeys]);

  /** 渲染节点 */
  const renderNode = useMemo(() => {
    const outerNode: (JSX.Element | null)[] = [];
    const innerNode: (JSX.Element | null)[] = [];
    searchNode.forEach((node: NodeType) => {
      let dom: any = null;
      const {
        hidden,
        type,
        label,
        questionTooltip,
        extraProps,
        options = [],
        optionsData = [],
        cascaderOptionMap,
        displayRender,
        key,
        placeholder,
        placeholders,
        getPopupContainer = () => document.body,
        onChange,
        onSearch,
        alwaysOnLoad,
        onLoad,
        width,
      } = node;

      /** label最长长度，超出打点 */
      const maxLabelLength = questionTooltip ? 8 : 10;

      const containerProps = {
        key,
        itemKey: key,
        hidden,
        label:
          label.length > maxLabelLength ? (
            <Tooltip title={label}>{`${label.substring(
              0,
              maxLabelLength
            )}...`}</Tooltip>
          ) : (
            `${label}`
          ),
        questionTooltip,
        width,
      };
      if (type === "input") {
        dom = (
          <NodeContainer {...containerProps}>
            <InputItem
              state={state}
              placeholder={placeholder}
              itemKey={key}
              extraProps={extraProps}
              changeState={changeState}
              onChange={onChange}
              onSearch={() => searchComponentBtnRef.current?.click()}
            />
          </NodeContainer>
        );
      } else if (type === "select" || type === "multiple") {
        dom = (
          <NodeContainer {...containerProps}>
            <SelectItem
              state={state}
              placeholder={placeholder}
              itemKey={key}
              extraProps={extraProps}
              changeState={changeState}
              type={type}
              getPopupContainer={getPopupContainer}
              onChange={onChange}
              onSearch={onSearch}
              alwaysOnLoad={alwaysOnLoad}
              onLoad={onLoad}
              options={options}
              optionsData={optionsData}
            />
          </NodeContainer>
        );
      } else if (type === "treeSelect" || type === "treeSelectMultiple") {
        dom = (
          <NodeContainer {...containerProps}>
            <TreeSelectItem
              state={state}
              placeholder={placeholder}
              itemKey={key}
              extraProps={extraProps}
              changeState={changeState}
              type={type}
              getPopupContainer={getPopupContainer}
              onChange={onChange}
              options={options}
              optionsData={optionsData}
            />
          </NodeContainer>
        );
      } else if (type === "rangeInput") {
        dom = (
          <NodeContainer {...containerProps}>
            <RangeInputItem
              itemKey={key}
              placeholders={placeholders}
              state={state}
              changeState={changeState}
              onChange={onChange}
            />
          </NodeContainer>
        );
      } else if (type === "cascader") {
        dom = (
          <NodeContainer {...containerProps}>
            <CascaderItem
              itemKey={key}
              placeholder={placeholder}
              state={state}
              changeState={changeState}
              cascaderOptionMap={cascaderOptionMap}
              getPopupContainer={getPopupContainer}
              extraProps={extraProps}
              displayRender={displayRender}
              onSearch={onSearch}
              onChange={onChange}
            />
          </NodeContainer>
        );
      } else if (type === "datePicker") {
        dom = (
          <NodeContainer {...containerProps}>
            <DatePickItem
              placeholder={placeholder}
              getPopupContainer={getPopupContainer}
              state={state}
              itemKey={key}
              changeState={changeState}
              extraProps={extraProps}
              onChange={onChange}
            />
          </NodeContainer>
        );
      } else if (type === "monthPicker") {
        dom = (
          <NodeContainer {...containerProps}>
            <MonthPickItem
              placeholder={placeholder}
              getPopupContainer={getPopupContainer}
              state={state}
              itemKey={key}
              changeState={changeState}
              extraProps={extraProps}
              onChange={onChange}
            />
          </NodeContainer>
        );
      } else if (type === "rangePicker") {
        dom = (
          <NodeContainer {...containerProps}>
            <RangePickerItem
              itemKey={key}
              placeholders={placeholders}
              getPopupContainer={getPopupContainer}
              state={state}
              changeState={changeState}
              extraProps={extraProps}
              onChange={onChange}
            />
          </NodeContainer>
        );
      }
      if (hidden) {
        innerNode.push(dom);
      } else {
        outerNode.push(dom);
      }
    });
    return {
      outerNode,
      innerNode,
    };
  }, [searchNode, state, changeState]);

  /** 重置 */

  // TODO onSearch reset 感觉有多余的关系，待优化
  const reset = useCallback(() => {
    setState({});
    setSearchState({});
    onSearch({}, "reset");
    changeVisible(false);
  }, [onSearch, changeVisible]);

  /** 累计筛选项 */
  const searchCount = useMemo(() => {
    const keys = Object.keys(searchState);
    const hasKeys: string[] = [];
    const { outerKeys, innerKeys, rangeKeys } = analysis;
    keys.forEach((key) => {
      if ([...outerKeys, ...innerKeys, ...rangeKeys].includes(key)) {
        const value = searchState[key];
        if (value || value === 0) {
          if (Array.isArray(value) && value.length > 0) {
            hasKeys.push(key);
          } else if (isObj(value) && Object.keys(value).length > 0) {
            hasKeys.push(key);
          } else if (!Array.isArray(value) && isObj(value)) {
            hasKeys.push(key);
          }
        }
      }
    });
    const singleKeys = Array.from(
      new Set(
        hasKeys.map((item) => item.replace("Low", "").replace("High", ""))
      )
    );
    return singleKeys?.length || 0;
  }, [searchState, analysis]);

  useEffect(() => {
    if (defaultValues) {
      setState(defaultValues);
      setSearchState(defaultValues);
    }
  }, [defaultValues]);

  /** 判断是否在组件内 */
  const contains = useCallback((e: MouseEvent) => {
    let ownFlag = false;
    let dropdownFlag = false;
    let selectClearFlag = false;
    if (searchComponentEl.current) {
      ownFlag = (searchComponentEl.current as any).contains(e.target);
    }
    const dropdownDom = document.querySelectorAll(`.${dropdownClassName}`);
    dropdownDom.forEach((element: any) => {
      if (element.contains(e.target)) {
        dropdownFlag = true;
      }
    });
    const selectClearDom = document.querySelectorAll(
      ".extra-design__search-component .ant-select-clear"
    );
    selectClearDom.forEach((element: any) => {
      if (element.contains(e.target)) {
        selectClearFlag = true;
      }
    });
    if (!(ownFlag || dropdownFlag || selectClearFlag)) {
      setVisible(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setState({});
      setSearchState({});
    },
    resetState: (paramNameList: string[]) => {
      const paramObjNeedClear = Object.assign(
        {},
        ...paramNameList.map((item) => ({ [item]: undefined }))
      );

      setState((pre: { [key: string]: any }) => ({
        ...pre,
        ...paramObjNeedClear,
      }));
      setSearchState((pre: { [key: string]: any }) => ({
        ...pre,
        ...paramObjNeedClear,
      }));
    },
  }));

  useEffect(() => {
    window.addEventListener("mouseup", contains);
    return () => {
      window.removeEventListener("mouseup", contains);
    };
  }, [contains]);

  return (
    <ConfigProvider locale={locale}>
      <div
        className={`${className}--container`}
        ref={searchComponentEl}
        tabIndex={-1}
      >
        <div className={`${className}--position`}>
          <div className={className}>
            {renderNode.outerNode}
            <div className={`${className}--btn`}>
              <Button
                type="primary"
                onClick={search}
                ref={searchComponentBtnRef}
              >
                查询
              </Button>
              {!hideResetButton && <Button onClick={reset}>重置</Button>}
              {searchExtraContent}
              {analysis.innerKeys.length > 0 && (
                <div
                  className={`${className}--switch`}
                  onClick={() => setVisible(!visible)}
                >
                  展开{searchCount > 0 && <span>（已选{searchCount}项）</span>}
                </div>
              )}
            </div>
          </div>
          {renderNode.innerNode.length > 0 && (
            <div
              className={classNames({
                [className]: true,
                [`${className}--popup`]: true,
                [`${className}--show`]: visible,
              })}
            >
              <div
                className={classNames({
                  [`${className}--popup--content`]: true,
                })}
              >
                {renderNode.outerNode}
                {renderNode.innerNode}
              </div>

              <div className={`${className}--btn`}>
                <Button type="primary" onClick={search}>
                  查询
                </Button>
                {!hideResetButton && <Button onClick={reset}>重置</Button>}
                {searchExtraContent}
                <div
                  className={`${className}--switch`}
                  onClick={() => setVisible(!visible)}
                >
                  收起
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default React.forwardRef(XuiSearchComponent);
