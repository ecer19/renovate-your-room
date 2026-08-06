import Icon from "@/components/Icon";

export default function PickerCard({ icon, label, isActive, tone, onClick }) {
  const activeClasses =
    tone === "accent"
      ? "border-[var(--accent)] bg-[var(--accent)]/10"
      : "border-[var(--teal)] bg-[var(--teal)]/10";

  const idleClasses = tone === "accent" ? "bg-[var(--accent)]/[0.05]" : "bg-[var(--teal)]/[0.05]";

  const iconWrapClasses =
    tone === "accent"
      ? "bg-[var(--accent)]/15 text-[var(--accent-deep)]"
      : "bg-[var(--teal)]/15 text-[var(--teal-deep)]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`card-frame-sm relative flex flex-col items-center gap-2 px-1.5 py-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${
        isActive ? `-translate-y-1 ${activeClasses}` : `${idleClasses} hover:-translate-y-0.5`
      }`}
    >
      <span
        className={`absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full transition-opacity ${
          isActive ? "opacity-100" : "opacity-0"
        } ${tone === "accent" ? "bg-[var(--accent)]" : "bg-[var(--teal)]"}`}
      />
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${iconWrapClasses}`}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span className="text-[9px] font-bold uppercase leading-tight tracking-wide text-[var(--ink)]">
        {label}
      </span>
    </button>
  );
}
