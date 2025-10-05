"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DefaultCover from "../assets/Default_BgFallback.png";

interface NewTripFormProps {
  onClose: () => void;
  onSave: (trip: {
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    coverUrl: string;
  }) => void;
}

const DEFAULT_COVER = (DefaultCover as any)?.src || (DefaultCover as unknown as string);

export function NewTripForm({ onClose, onSave }: NewTripFormProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCover, setSelectedCover] = useState<string>(DEFAULT_COVER);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let coverUrl = selectedCover;
    if (file) {
      try {
        setUploading(true);
        const key = `trip-covers/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, key);
        const blob = await resizeImageToCover(file, 1000, 200);
        await uploadBytes(storageRef, blob, { contentType: blob.type });
        coverUrl = await getDownloadURL(storageRef);
      } finally {
        setUploading(false);
      }
    }
    onSave({
      title,
      location,
      startDate,
      endDate,
      coverUrl,
    });
  };

  function validateAndPreview(f: File | null) {
    if (!f) return;
    const allowed = ["image/jpeg", "image/png"];
    if (!allowed.includes(f.type)) {
      setError("Formato inválido. Use JPEG ou PNG.");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setError("Arquivo muito grande. Máximo 2 MB.");
      return;
    }
    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(url);
    setSelectedCover("");
  }

  async function resizeImageToCover(file: File, width: number, height: number): Promise<Blob> {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject as any;
      i.src = URL.createObjectURL(file);
    });
    const srcRatio = img.width / img.height;
    const dstRatio = width / height;
    let sx = 0;
    let sy = 0;
    let sWidth = img.width;
    let sHeight = img.height;
    if (srcRatio > dstRatio) {
      sWidth = Math.round(img.height * dstRatio);
      sx = Math.round((img.width - sWidth) / 2);
    } else if (srcRatio < dstRatio) {
      sHeight = Math.round(img.width / dstRatio);
      sy = Math.round((img.height - sHeight) / 2);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve((b as Blob) || new Blob()), "image/jpeg", 0.92)
    );
    URL.revokeObjectURL(img.src);
    return blob;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2x1">Nova Viagem</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/10 transition-colors"
            aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título da viagem</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Verão em Roma"
              required
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Roma, Itália"
              required
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de início</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de término</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Escolha uma imagem de capa</Label>

            <div className="pt-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) validateAndPreview(f);
                }}
                className={`rounded-2xl p-6 border-2 ${
                  isDragging
                    ? "border-teal-400 bg-teal-500/5"
                    : "border-dashed border-white/10 bg-white/5"
                } text-center transition-colors`}>
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Preview da capa"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <div className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">
                        Alterar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setPreviewUrl(null);
                          setSelectedCover(DEFAULT_COVER);
                        }}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white">
                        Excluir
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" className="text-white/70">
                        <path
                          fill="currentColor"
                          d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-1 12l-2.5-3l-1.5 2l-2-3l-3 4H6v2h12z"
                        />
                      </svg>
                    </div>
                    <label
                      htmlFor="coverUpload"
                      className="inline-block px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer">
                      Upload
                    </label>
                    <p className="text-white/60 mt-4">Ou arraste e solte a imagem aqui</p>
                    <p className="text-white/30 text-sm mt-2">size: 1000×200 px Max: 2 MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  id="coverUpload"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    if (f) validateAndPreview(f);
                  }}
                  className="hidden"
                />
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              {/* {!previewUrl && (
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={DEFAULT_COVER}
                    alt="Capa padrão"
                    className="w-24 h-16 object-cover rounded-lg border border-white/10"
                  />
                  <p className="text-white/50 text-sm">Sem upload, usaremos esta imagem padrão.</p>
                </div>
              )} */}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-teal-400 text-black hover:bg-teal-500 disabled:opacity-60">
              {uploading ? "Enviando..." : "Criar Viagem"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
