"use client";
import { useState, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import DefaultCover from "../assets/Default_BgFallback.png";
import { motion } from "motion/react";

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
  const [error, setError] = useState<string | null>(null);

  // Memoizar validação do formulário
  const isFormValid = useMemo(() => {
    return title.trim() && location.trim() && startDate && endDate;
  }, [title, location, startDate, endDate]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid) {
        setError("Preencha todos os campos obrigatórios");
        return;
      }

      onSave({
        title,
        location,
        startDate,
        endDate,
        coverUrl: selectedCover,
      });
    },
    [title, location, startDate, endDate, selectedCover, isFormValid, onSave]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0a0a0a] py-6 px-4 max-h-[90vh] overflow-y-auto">
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
              autoComplete="off"
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
              autoComplete="off"
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
                autoComplete="off"
                required
                className="bg-white/5 border-white/10 text-xs lg:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de término</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                autoComplete="off"
                required
                className="bg-white/5 border-white/10 text-xs lg:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Escolha uma imagem de capa</Label>

            <div className="pt-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  {
                    url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc1OTM2MjAwNXww&ixlib=rb-4.1.0&q=80&w=400",
                    title: "Aventura",
                  },
                  {
                    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU5MzYyMDA1fDA&ixlib=rb-4.1.0&q=80&w=400",
                    title: "Natureza",
                  },
                  {
                    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbnxlbnwxfHx8fDE3NTkzNjIwMDV8MA&ixlib=rb-4.1.0&q=80&w=400",
                    title: "Montanhas",
                  },
                  {
                    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaHxlbnwxfHx8fDE3NTkzNjIwMDV8MA&ixlib=rb-4.1.0&q=80&w=400",
                    title: "Praia",
                  },
                  {
                    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3R8ZW58MXx8fHwxNzU5MzYyMDA1fDA&ixlib=rb-4.1.0&q=80&w=400",
                    title: "Floresta",
                  },
                  {
                    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5fGVufDF8fHx8MTc1OTM2MjAwNXww&ixlib=rb-4.1.0&q=80&w=400",
                    title: "Cidade",
                  },
                ].map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedCover(image.url)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      selectedCover === image.url
                        ? "border-teal-400 ring-2 ring-teal-400/20"
                        : "border-white/10 hover:border-white/20"
                    }`}>
                    <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">{image.title}</span>
                    </div>
                    {selectedCover === image.url && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <Label htmlFor="customImageUrl">Ou use uma URL personalizada</Label>
                <Input
                  id="customImageUrl"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  autoComplete="off"
                  className="bg-white/5 border-white/10 text-white mt-2"
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedCover(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
              Criar Viagem
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
