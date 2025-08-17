import { Link } from "react-router";
import "../styles/utils/Breadcrumbs.css";

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${
              index === breadcrumbs.length - 1 ? "active" : ""
            }`}
            aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}
          >
            {crumb.link ? (
              <Link to={crumb.link}>{crumb.label}</Link>
            ) : (
              crumb.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
