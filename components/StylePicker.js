export default function StylePicker({ options, value, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onSelect(option.key)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            value === option.key
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 text-slate-600 hover:border-slate-400"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
