import React, { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import './RowActionsMenu.css';

/**
 * RowActionsMenu (shared)
 *
 * Generic "⋮" row-actions dropdown for any list/table across the
 * recruiter portal. Backs Job Management's View/Edit/Close menu today
 * and can back Applications/Placement Management row menus later -
 * it has no idea what the items do, it just renders them and closes
 * itself on click-outside or after an item is chosen.
 *
 * Props:
 *  - items: array of { id, label, icon (lucide component), onClick, danger? }
 */
const RowActionsMenu = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="row-actions-menu" ref={containerRef}>
      <button
        type="button"
        className="row-actions-menu__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Row actions"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <ul className="row-actions-menu__dropdown" role="menu">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="menuitem"
                  className={`row-actions-menu__item ${item.danger ? 'row-actions-menu__item--danger' : ''}`}
                  onClick={() => {
                    setIsOpen(false);
                    item.onClick?.();
                  }}
                >
                  {Icon && <Icon size={16} strokeWidth={1.8} />}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RowActionsMenu;
