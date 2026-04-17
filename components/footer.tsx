export default function Footer() {
  return (
    <footer className="border-t border-frame bg-paper/80 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-5 md:grid-cols-4 md:px-8">
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-3xl text-ink">RepoLens</span>
          <p className="mt-4 text-sm leading-7 text-muted">
            © 2026 RepoLens. Built for engineers who want signal before commitment.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-muted">Resources</span>
          <a className="text-sm text-muted transition-colors hover:text-ink" href="#">Documentation</a>
          <a className="text-sm text-muted transition-colors hover:text-ink" href="#">Pricing</a>
          <a className="text-sm text-muted transition-colors hover:text-ink" href="#">Blog</a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-muted">Community</span>
          <a className="text-sm text-muted transition-colors hover:text-ink" href="#">GitHub</a>
          <a className="text-sm text-muted transition-colors hover:text-ink" href="#">Twitter</a>
          <a className="text-sm text-muted transition-colors hover:text-ink" href="#">LinkedIn</a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-muted">Contact</span>
          <a className="text-sm text-muted transition-colors hover:text-ink" href="#">Support</a>
          <a className="text-sm text-muted transition-colors hover:text-ink" href="#">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
