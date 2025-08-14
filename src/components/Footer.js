import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <div className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>
              We are a leading platform for sharing knowledge, discussions, and
              content in various fields.
            </p>
          </div>

          <div className="col-md-4">
            <h5>Useful Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/privacy-policy" className="text-white footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-white footer-link">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white footer-social-icon"
              >
                <FaFacebook size={30} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white footer-social-icon"
              >
                <FaTwitter size={30} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white footer-social-icon"
              >
                <FaInstagram size={30} />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>&copy; {new Date().getFullYear()} SLINKUP. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
