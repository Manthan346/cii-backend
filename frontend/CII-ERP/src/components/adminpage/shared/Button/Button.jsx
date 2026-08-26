import React from 'react';
import './Button.css';

/**
 * Button
 *
 * Generic action button used across admin pages - "Export As", "Apply
 * Filters", "Add user", and similar primary actions on other pages.
 * Lives in /shared so every page gets the same button chrome for free.
 *
 * Props:
 *  - variant: 'primary' | 'secondary' | 'danger' | 'success' | 'accent'  ->
 *             visual style. 'danger'/'success' are the soft red/green chips
 *             used for "Deactivated Account"/"Rejected" and "Reactivate"/
 *             "Approved". 'accent' is a white pill with blue text/border,
 *             used for "Edit Profile" and "Upload New Picture".
 *             Defaults to 'primary' (solid blue).
 *  - size: 'md' | 'sm'                  -> Defaults to 'md'.
 *  - shape: 'rounded' | 'pill'          -> 'pill' is fully rounded, used for
 *           the "← Back" button. Defaults to 'rounded'.
 *  - icon: LucideIcon                    -> optional icon rendered before the label.
 *  - onClick: function
 *  - type: 'button' | 'submit'           -> Defaults to 'button' (safe default outside forms).
 *  - children: ReactNode                 -> button label
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  icon: Icon,
  onClick,
  type = 'button',
  children,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`admin-button admin-button--${variant} admin-button--${size} admin-button--${shape}`}
      onClick={onClick}
      {...rest}
    >
      {Icon && <Icon size={size === 'sm' ? 15 : 16} strokeWidth={2.2} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
