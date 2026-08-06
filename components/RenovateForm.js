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
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">1. Oda Fotoğrafı</label>
        <ImageUploader previewUrl={form.imagePreviewUrl} onSelect={onSelectImage} onClear={onClearImage} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">2. Oda Türü</label>
        <RoomTypePicker options={ROOM_TYPES} value={form.roomType} onSelect={onSelectRoomType} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">3. Dekorasyon Stili</label>
        <StylePicker options={STYLES} value={form.style} onSelect={onSelectStyle} />
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="mt-2 w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? "Odan yeniden tasarlanıyor..." : "Renovate"}
      </button>
    </form>
  );
}
