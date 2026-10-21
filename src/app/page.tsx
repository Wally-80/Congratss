import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Globe2,
  Heart,
  MessageCircle,
  MousePointer2,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ModernHeader from "@/components/modern/ModernHeader";
import JoyCharacter from "@/components/modern/JoyCharacter";
import InstalledAppEntry from "@/components/modern/InstalledAppEntry";
import "./modern.css";

export default function Home() {
  return (
    <div className="modern">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ModernHeader />
      <InstalledAppEntry />
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span /> A little more feeling. A lot more you.
            </p>
            <h1>
              Turn any message
              <br className="desktop-break" /> into something{" "}
              <span className="headline-glow">unforgettable.</span>
            </h1>
            <p className="hero-subheading">
              Write anything. Make it beautiful. Share it anywhere.
            </p>
            <div className="hero-actions">
              <Link href="/create" className="primary-cta">
                Create Card <ArrowUpRight size={20} />
              </Link>
              <Link href="#possibilities" className="text-cta">
                Find your inspiration <ArrowRight size={17} />
              </Link>
            </div>
            <p className="hero-note">
              <Check size={14} /> Your words. Your style. No account needed to
              start.
            </p>
          </div>
          <div
            className="hero-art"
            aria-label="A personal message surrounded by original smiling characters"
            role="img"
          >
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <span className="art-spark spark-one">✦</span>
            <span className="art-spark spark-two">✧</span>
            <span className="art-spark spark-three">+</span>
            <div className="floating-badge">
              <span className="status-dot" /> made to make their day
            </div>
            <JoyCharacter kind="heart" className="hero-heart float-slow" />
            <div className="hero-card">
              <div className="card-topline">
                <span>JUST BECAUSE</span>
                <Heart size={15} />
              </div>
              <span className="card-mini-star">✦</span>
              <p>
                Life’s better
                <br />
                with you in it.
              </p>
              <div className="card-handwritten">
                a little reminder, from me to you.
              </div>
              <div className="card-signature">
                <span>With love</span>
                <span>↗</span>
              </div>
            </div>
            <JoyCharacter kind="orb" className="hero-orb float-slow" />
            <JoyCharacter kind="star" className="hero-star float-slow" />
            <div className="art-cursor">
              <MousePointer2 size={18} fill="#a78bfa" />
              <span>you, but a little extra</span>
            </div>
            <div className="mini-toast">
              <span>
                <Check size={14} />
              </span>
              A small message. A big feeling.
            </div>
          </div>
        </section>
        <div
          className="purpose-strip"
          aria-label="Made for every kind of message"
        >
          <span>BIG FEELINGS. EVERYDAY THINGS.</span>
          <span>
            <Heart size={16} /> Greetings
          </span>
          <span>
            <Sparkles size={16} /> Invitations
          </span>
          <span>
            <MessageCircle size={16} /> Announcements
          </span>
          <span>
            <Check size={16} /> Little reminders
          </span>
        </div>
        <section className="possibilities modern-section" id="possibilities">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                NOT JUST A CARD. YOUR KIND OF CONNECTION.
              </p>
              <h2>
                Whatever you want to say,
                <br />
                <span>make it feel like you.</span>
              </h2>
            </div>
            <Link href="/create" className="text-cta">
              Explore the creator <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="example-grid">
            <Link
              href="/create?template=little-joy"
              className="example-tile tile-violet"
            >
              <span className="tile-label">FOR YOUR FAVORITE HUMAN</span>
              <JoyCharacter kind="orb" />
              <h3>
                Big love.
                <br />
                Little message.
              </h3>
              <span className="tile-bottom">
                Greetings & celebrations <ArrowUpRight size={19} />
              </span>
            </Link>
            <Link
              href="/create?template=after-hours"
              className="example-tile tile-pink"
            >
              <span className="tile-label">MAKE IT AN OCCASION</span>
              <div className="invite-graphic">
                <span>YOU’RE</span>
                <strong>invited.</strong>
                <span>GOOD TIMES AHEAD ↗</span>
              </div>
              <span className="tile-bottom">
                Invitations & events <ArrowUpRight size={19} />
              </span>
            </Link>
            <Link
              href="/create?template=hello-business"
              className="example-tile tile-blue"
            >
              <span className="tile-label">SOMETHING WORTH SHARING</span>
              <div className="business-graphic">
                <span className="business-symbol">✳</span>
                <h3>
                  Meet your next
                  <br />
                  great idea.
                </h3>
                <span className="business-pill">
                  Let’s connect <ArrowUpRight size={14} />
                </span>
              </div>
              <span className="tile-bottom">
                Business & beyond <ArrowUpRight size={19} />
              </span>
            </Link>
          </div>
          <p className="possibilities-note">
            And the everyday in between: announcements, instructions,
            checklists, reminders, and anything on your mind.
          </p>
        </section>
        <section className="how-section modern-section">
          <div>
            <p className="eyebrow">FROM A THOUGHT TO THEIR SCREEN</p>
            <h2>
              Three little steps.
              <br />
              <span>Endless possibilities.</span>
            </h2>
            <p className="section-description">
              No blank-page pressure. No design degree.
              <br />
              Just a little spark, and your words.
            </p>
            <Link href="/create" className="primary-cta">
              Let’s make something <Plus size={19} />
            </Link>
          </div>
          <ol className="step-list">
            {[
              [
                "01",
                "Say your thing.",
                "A heartfelt hello, an invitation, or your next big idea. Start with your own words.",
              ],
              [
                "02",
                "Make it yours.",
                "Choose a mood, add the details, and watch your card come together.",
              ],
              [
                "03",
                "Send a little magic.",
                "Publish a link, share through your favorite app, or download your card.",
              ],
            ].map(([n, title, description]) => (
              <li key={n}>
                <span className="step-number">{n}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="final-cta modern-section">
          <span className="eyebrow">LESS ORDINARY. MORE YOU.</span>
          <h2>
            Someone’s day is
            <br />
            about to get better.
          </h2>
          <Link href="/create" className="primary-cta">
            Create Card <ArrowUpRight size={19} />
          </Link>
          <div className="trust-notes">
            <span>
              <ShieldCheck size={16} /> You choose what to publish
            </span>
            <span>
              <Globe2 size={16} /> Made for sharing
            </span>
          </div>
        </section>
      </main>
      <footer className="modern-footer">
        <span className="modern-brand">
          congratss<span className="brand-dot">.</span>
        </span>
        <p>A little message. A lasting feeling.</p>
        <nav aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/about">About</Link>
        </nav>
      </footer>
    </div>
  );
}
