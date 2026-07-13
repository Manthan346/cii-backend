// src/components/candidatepage/Schedule/components/ClassEtiquette/ClassEtiquette.jsx
import PropTypes from "prop-types";
import { Lightbulb, MicOff, Briefcase } from "lucide-react";
import styles from "./ClassEtiquette.module.css";

// Maps the serializable `iconKey` coming from the data/API layer to an
// actual icon component, so the mock/API data never has to store JSX.
const ICON_MAP = {
  lightbulb: Lightbulb,
  mute: MicOff,
  attendance: Briefcase,
};

/**
 * Right-hand panel listing class etiquette tips. Entirely data driven —
 * pass an `items` array and nothing needs to change in this component.
 */
function ClassEtiquette({ title, items }) {
  return (
    <aside className={styles.panel} aria-label={title}>
      <h3 className={styles.heading}>{title}</h3>
      <ul className={styles.list}>
        {items.map((item) => {
          const Icon = ICON_MAP[item.iconKey] ?? Lightbulb;
          return (
            <li key={item.id} className={styles.item}>
              <span
                className={styles.iconWrap}
                style={{ backgroundColor: item.backgroundColor }}
                aria-hidden="true"
              >
                <Icon size={16} color={item.iconColor} />
              </span>
              <p className={styles.text}>{item.text}</p>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

ClassEtiquette.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      iconKey: PropTypes.string.isRequired,
      iconColor: PropTypes.string.isRequired,
      backgroundColor: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
};

ClassEtiquette.defaultProps = {
  title: "Class etiquette",
};

export default ClassEtiquette;
