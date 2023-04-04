export type WarningAlertProps = {
  type?: "warning" | "error";
  icon?: React.ReactNode | boolean;
  style?: React.CSSProperties;
} & ({ text: React.ReactNode } | { children: React.ReactNode });

declare const WarningAlert: React.ComponentType<WarningAlertProps>;

export default WarningAlert;
