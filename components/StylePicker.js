import PickerCard from "@/components/PickerCard";

export default function StylePicker({ options, value, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map((option, index) => (
        <PickerCard
          key={option.key}
          icon={option.key}
          label={option.label}
          isActive={value === option.key}
          tone={index % 2 === 0 ? "teal" : "accent"}
          onClick={() => onSelect(option.key)}
        />
      ))}
    </div>
  );
}
