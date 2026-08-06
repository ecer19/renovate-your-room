import PickerCard from "@/components/PickerCard";

const WIDTHS = ["w-20", "w-28", "w-24", "w-20", "w-28", "w-24", "w-20", "w-24"];

export default function StylePicker({ options, value, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option, index) => (
        <div key={option.key} className={WIDTHS[index % WIDTHS.length]}>
          <PickerCard
            icon={option.key}
            label={option.label}
            image={option.image}
            isActive={value === option.key}
            tone={index % 2 === 0 ? "teal" : "accent"}
            onClick={() => onSelect(option.key)}
          />
        </div>
      ))}
    </div>
  );
}
