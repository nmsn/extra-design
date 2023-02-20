import styles from './Table.less';

interface HeaderItem {
  [key: string]: string;
}
interface TableProps {
  header: HeaderItem;
  data: DataItem[];
  hasIndex?: boolean;
  span?: { [key: string]: number };
}

export interface DataItem {
  [key: string]: number | string | JSX.Element;
}

const Table: React.FC<TableProps> = ({ header, data, hasIndex = false, span }) => {
  const headerKeys = Object.keys(header);
  const headerObj = Object.entries(header);

  const spanTotal = span ? Object.values(span).reduce((total, cur) => total + cur) : 0;
  const defaultTdWidth = `${100 / headerKeys.length}%`;

  const displayHeader: { title: string; style: React.CSSProperties }[] = headerObj.map(
    ([key, title]) => {
      return {
        title,
        style: { width: span ? `${(span[key] / spanTotal) * 100}%` : defaultTdWidth },
      };
    },
  );

  if (hasIndex) {
    displayHeader.unshift({ title: '序号', style: { minWidth: '50px' } });
  }

  const headerLine = displayHeader?.map(({ title, style }, index) => (
    <th key={+index} style={style}>
      {title}
    </th>
  ));

  const content = data?.map((item, index) => {
    return (
      <tr key={+index}>
        {hasIndex ? <td>{index + 1}</td> : undefined}
        {headerKeys?.map(key => (
          <td key={key}>{item[key]}</td>
        ))}
      </tr>
    );
  });

  return (
    <div className={styles.table}>
      <table>
        <thead>
          <tr>{headerLine}</tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
    </div>
  );
};

export default Table;
