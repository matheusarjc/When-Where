"use client";
import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ImageWithFallback } from "./media/ImageWithFallback";

interface NewMemoryFormProps {
  onClose: () => void;
  onSave: (memory: {
    type: "note" | "photo" | "tip";
    content: string;
    mediaUrl?: string;
    openAt?: string;
  }) => void;
  tripId?: string;
}

export function NewMemoryForm({ onClose, onSave, tripId }: NewMemoryFormProps) {
  const [type, setType] = useState<"note" | "photo" | "tip">("note");
  const [content, setContent] = useState("");
  const [isCapsule, setIsCapsule] = useState(false);
  const [openAt, setOpenAt] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setType("photo");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type,
      content,
      mediaUrl: previewUrl || undefined,
      openAt: isCapsule ? openAt : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2>Nova Memória</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/10 transition-colors"
            aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Tipo de memória</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setType("note")}
                className={`rounded-xl p-3 border transition-all ${
                  type === "note"
                    ? "border-teal-400 bg-teal-400/10 text-teal-400"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}>
                Nota
              </button>
              <button
                type="button"
                onClick={() => setType("tip")}
                className={`rounded-xl p-3 border transition-all ${
                  type === "tip"
                    ? "border-teal-400 bg-teal-400/10 text-teal-400"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}>
                Dica
              </button>
              <button
                type="button"
                onClick={() => setType("photo")}
                className={`rounded-xl p-3 border transition-all ${
                  type === "photo"
                    ? "border-teal-400 bg-teal-400/10 text-teal-400"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}>
                Foto
              </button>
            </div>
          </div>

          {type === "photo" && (
            <div className="space-y-2">
              <Label htmlFor="image">Imagem</Label>
              <div className="relative">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  {previewUrl ? (
                    <ImageWithFallback
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-white/40 mb-2" />
                      <span className="text-white/60">Clique para fazer upload</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">
              {type === "tip" ? "Sua dica" : type === "photo" ? "Legenda" : "Sua nota"}
            </Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === "tip"
                  ? "Ex: Reserve com antecedência para evitar filas..."
                  : type === "photo"
                  ? "Descreva este momento..."
                  : "Escreva suas memórias, pensamentos ou reflexões..."
              }
              required
              rows={4}
              className="w-full rounded-xl p-3 bg-white/5 border border-white/10 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isCapsule"
                checked={isCapsule}
                onChange={(e) => setIsCapsule(e.target.checked)}
                className="rounded border-white/20 bg-white/5"
              />
              <Label htmlFor="isCapsule" className="cursor-pointer">
                🕰️ Transformar em Cápsula do Tempo
              </Label>
            </div>

            {isCapsule && (
              <div className="space-y-2 pl-7">
                <Label htmlFor="openAt">Abrir em</Label>
                <input
                  type="datetime-local"
                  id="openAt"
                  value={openAt}
                  onChange={(e) => setOpenAt(e.target.value)}
                  required={isCapsule}
                  className="w-full rounded-xl p-3 bg-white/5 border border-white/10 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
                <p className="text-white/50">Esta memória só será revelada na data escolhida</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-teal-400 text-black hover:bg-teal-500">
              Salvar Memória
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
