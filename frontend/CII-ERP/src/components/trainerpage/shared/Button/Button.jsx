import styles from './Button.module.css';

/**
 * Reusable button used across the Staff Panel.
 * variant: 'primary' (filled teal) | 'outline' (white, bordered)
 * icon: optional lucide-react icon component
 */
export default function Button({
  children,
  variant = 'primary',
  icon: Icon,
  iconPosition = 'right',
  onClick,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant] || styles.primary}`}
      onClick={onClick}
      {...rest}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} className={styles.icon} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={16} className={styles.icon} />}
    </button>
  );
}
