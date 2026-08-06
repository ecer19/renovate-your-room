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
    <form onSubmit={onSubmit} className="flex flex-col gap-14">
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl text-[var(--accent)]">01</span>
          <h2 className="font-display text-xl text-[var(--ink)]">Oda Fotoğrafı</h2>
        </div>
        <ImageUploader previewUrl={form.imagePreviewUrl} onSelect={onSelectImage} onClear={onClearImage} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl text-[var(--teal)]">02</span>
          <h2 className="font-display text-xl text-[var(--ink)]">Oda Türü</h2>
        </div>
        <RoomTypePicker options={ROOM_TYPES} value={form.roomType} onSelect={onSelectRoomType} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl text-[var(--accent)]">03</span>
          <h2 className="font-display text-xl text-[var(--ink)]">Dekorasyon Stili</h2>
        </div>
        <StylePicker options={STYLES} value={form.style} onSelect={onSelectStyle} />
      </section>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="card-frame bg-[var(--accent)] px-14 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[var(--accent-deep)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-deep)] focus-visible:ring-offset-2"
        >
          {isLoading ? "Oluşturuluyor..." : "Renovate"}
        </button>
      </div>
    </form>
  );
}
