import ImageUploader from "@/components/ImageUploader";
import RoomTypePicker from "@/components/RoomTypePicker";
import StylePicker from "@/components/StylePicker";
import { ROOM_TYPES, STYLES } from "@/lib/constants";

export default function RenovateForm({
  form,
  onSelectImage,
  onClearImage,
  onSelectRoomType,
  onSelectStyle,
  onSubmit,
  isValid,
  status,
}) {
  const isLoading = status === "loading";

  return (
    <form onSubmit={onSubmit} className="card-frame flex flex-col gap-6 bg-[var(--card)] p-5 sm:p-7">
      <div className="flex flex-col gap-2">
        <label className="font-display text-xs uppercase tracking-wide text-[var(--ink)]">
          1 · Oda Fotoğrafı
        </label>
        <ImageUploader previewUrl={form.imagePreviewUrl} onSelect={onSelectImage} onClear={onClearImage} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-display text-xs uppercase tracking-wide text-[var(--ink)]">
          2 · Oda Türü
        </label>
        <RoomTypePicker options={ROOM_TYPES} value={form.roomType} onSelect={onSelectRoomType} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-display text-xs uppercase tracking-wide text-[var(--ink)]">
          3 · Dekorasyon Stili
        </label>
        <StylePicker options={STYLES} value={form.style} onSelect={onSelectStyle} />
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="card-frame-sm mt-1 w-full bg-[var(--accent)] px-6 py-3 font-display text-sm uppercase tracking-wide text-white transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-deep)] focus-visible:ring-offset-2"
      >
        {isLoading ? "Oluşturuluyor..." : "Renovate"}
      </button>
    </form>
  );
}
