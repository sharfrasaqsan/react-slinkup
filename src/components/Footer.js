import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="text-center p-3 border-top">
        © {new Date().getFullYear()} Slinkup. Connecting People, Building
        Communities. All Rights Reserved.
      </div>
    </footer>
  );
}
