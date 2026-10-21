import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
export default function ModernHeader() {
  return (
    <header className="modern-header">
      <Link href="/" className="modern-brand" aria-label="Congratss home">
        <span className="brand-mark">
          <Sparkles size={21} />
        </span>
        congratss<span className="brand-dot">.</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/#possibilities" className="desktop-nav">
          The possibilities
        </Link>
        <Link href="/dashboard">
          Dashboard <ArrowUpRight size={14} />
        </Link>
        <Link href="/create" className="small-cta">
          Create Card <ArrowUpRight size={15} />
        </Link>
      </nav>
    </header>
  );
}
