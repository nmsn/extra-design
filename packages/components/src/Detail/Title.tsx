import styles from './Title.less';

type TitleProps = {
  title?: string;
  anchor?: string;
  bottom?: number;
  extra?: React.ReactNode | null;
  children?: React.ReactNode | null;
  style?: React.CSSProperties;
};

const Title = ({ title = '', extra, anchor = '', bottom = 20, children, style }: TitleProps) => (
  <div className={styles.title} style={{ ...style, marginBottom: bottom }} id={anchor}>
    <div className={styles.titleLabel}>{children || title}</div>
    <div className={styles.titleExtra}>{extra}</div>
  </div>
);

export default Title;
