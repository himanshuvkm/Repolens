export default function Footer() {
  return (
    <footer className="bg-surface py-20 border-t border-outline-variant/10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-8 max-w-7xl mx-auto">
        <div className="col-span-2 md:col-span-1">
          <span className="text-lg font-bold text-white mb-6 block">
            RepoLens
          </span>
          <p className="text-sm text-on-surface-variant leading-relaxed opacity-80">
            © 2026 RepoLens AI. Built for the modern developer.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-outline">
            Resources
          </span>
          <a
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Documentation
          </a>
          <a
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Pricing
          </a>
          <a
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Blog
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-outline">
            Community
          </span>
          <a
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            GitHub
          </a>
          <a
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Twitter
          </a>
          <a
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            LinkedIn
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-outline">
            Contact
          </span>
          <a
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Support
          </a>
          <a
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
