import React, { CSSProperties, ReactText } from 'react';

import { Tag } from 'antd';

import PicShow from '../PicShow';
import Table, { DataItem } from './Table';

import styles from './Descriptions.less';

export interface DescriptionsProps {
  data: DescriptionsItemProps[];
  /** 每行栅格数 */
  grid?: 1 | 2 | 3 | 4;
  style?: CSSProperties;
}

export interface DescriptionsItemProps {
  label: string;
  value:
    | ReactText
    | ReactText[]
    | JSX.Element
    | string[][]
    | (() => JSX.Element)
    | { url: string; thumb: string }
    | undefined;
  type?: 'tag' | 'table' | 'pic';
  span?: number;
  tableSpan?: { [key: string]: number };
  header?: { [key: string]: string };
  hasIndex?: boolean;
  unit?: string;
}

type PicItemProps = {
  picProp: { url: string; thumb?: string } | string;
  style?: React.CSSProperties;
};
export const PicItem: React.FC<PicItemProps> = ({ picProp, style }) => {
  if (typeof picProp === 'object') {
    return (
      <PicShow
        src={picProp.url}
        thumb={picProp.thumb}
        style={{ width: 100, padding: 5, ...style }}
      />
    );
  }
  return <PicShow src={picProp} style={{ width: 100, padding: 5, ...style }} />;
};

const formatValue = (
  param: DescriptionsItemProps['value'],
  type?: DescriptionsItemProps['value'],
  header?: { [key: string]: string },
  hasIndex?: boolean,
  unit?: string,
  tableSpan?: { [key: string]: number },
) => {
  let result;
  if (type === 'tag' && Array.isArray(param) && param.length) {
    result = param.map(item => (
      <Tag style={{ marginBottom: 6 }} key={item as ReactText}>
        {item}
      </Tag>
    ));
  } else if (type === 'table') {
    result =
      Array.isArray(param) && param?.length ? (
        <Table
          header={header!}
          data={(param as any) as DataItem[]}
          hasIndex={hasIndex}
          span={tableSpan}
        />
      ) : (
        EMPTY_TEXT_MARK
      );
  } else if (type === 'pic') {
    if (Array.isArray(param) && param.length) {
      result = (
        <div>
          {param?.map((item, index) => (
            <PicItem picProp={item as PicItemProps['picProp']} key={+index} />
          ))}
        </div>
      );
    } else if (typeof param === 'object' && (param as { url: string; thumb?: string })?.url) {
      result = <PicItem picProp={param as { url: string; thumb?: string }} />;
    } else if (typeof param === 'string' && param !== '') {
      result = <PicItem picProp={{ url: param }} />;
    } else {
      result = EMPTY_TEXT_MARK;
    }
  } else if (param === -1) {
    result = EMPTY_TEXT_MARK;
  } else if (typeof param === 'number' || param === '0') {
    result = param;
  } else if (typeof param === 'function') {
    result = param?.() || EMPTY_TEXT_MARK;
  } else {
    result = param || EMPTY_TEXT_MARK;
  }

  if (unit && result !== EMPTY_TEXT_MARK) {
    result = `${result}${unit}`;
  }
  return result;
};

const Descriptions: React.FC<DescriptionsProps> = ({ data, grid = 3, style }) => {
  return Array.isArray(data) && data.length ? (
    <div className={styles.gridContainer} style={{ gridTemplateColumns: `repeat(${grid}, 1fr` }}>
      {data.map(({ label, value, type, span, header, hasIndex, unit, tableSpan }) => (
        <div
          className={styles.gridItem}
          key={label}
          style={span ? { gridColumnStart: `span ${span}`, ...style } : { ...style }}
        >
          <div className={styles.gridItemLabel}>{label}:</div>
          <div className={styles.gridItemValue}>
            {formatValue(value, type, header, hasIndex, unit, tableSpan)}
          </div>
        </div>
      ))}
    </div>
  ) : null;
};

export default Descriptions;
