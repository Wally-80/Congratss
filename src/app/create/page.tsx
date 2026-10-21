import ModernHeader from "@/components/modern/ModernHeader";
import CardCreator from "@/components/modern/CardCreator";
import "../modern.css";
import "./creator.css";
export default function CreatePage() {
  return (
    <div className="modern">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ModernHeader />
      <CardCreator />
    </div>
  );
}
