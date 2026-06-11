export default function Footer() {
  return (
    <footer className="mt-8 py-5 text-center">
      <div className="glass card mx-auto inline-block px-5 py-2.5">
        <p className="text-xs font-semibold text-muted">
          Developed by <span className="text-brand-500">AAHA</span>
        </p>
        <p className="text-[11px] text-muted">
          Contact:{" "}
          <a
            href="mailto:hubaibahamedaaha@gmail.com"
            className="text-brand-500 hover:underline"
          >
            hubaibahamedaaha@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
