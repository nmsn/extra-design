import React from "react";
import styles from "./LineableText.less";

const LineableText = ({ text }: { text: string }) => {
  const arr = text && typeof text === "string" ? text.split("\n") : [];
  return (
    <div className={styles.lineableText}>
      {arr.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
};

export default LineableText;
