"use client";

export function CaseImage({ igIndex, alt }: { igIndex: number; fallback: string; alt: string }) {
  return (
    <div
      style={{
        aspectRatio: "4/3",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 40,
        background: "var(--beige)",
      }}
    >
      <img
        src={`/images/cases/ig-${igIndex}.jpg`}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
