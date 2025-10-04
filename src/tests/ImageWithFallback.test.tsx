import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImageWithFallback } from "../components/media/ImageWithFallback";

function mockImgError(img: HTMLImageElement) {
  const evt = new Event("error");
  img.dispatchEvent(evt);
}

describe("ImageWithFallback", () => {
  it("renderiza a imagem quando src é válido", () => {
    render(
      <ImageWithFallback
        src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAIA"
        alt="ok"
      />
    );
    const img = screen.getByAltText("ok") as HTMLImageElement;
    expect(img).toBeInTheDocument();
  });

  it("exibe fallback quando a imagem falha", async () => {
    render(<ImageWithFallback src="invalid://" alt="broken" />);
    const img = screen.getByAltText("broken") as HTMLImageElement;
    fireEvent.error(img);
    await waitFor(() => {
      const fallback = screen.getByAltText("Error loading image") as HTMLImageElement;
      expect(fallback).toHaveAttribute("data-original-url", "invalid://");
    });
  });
});
