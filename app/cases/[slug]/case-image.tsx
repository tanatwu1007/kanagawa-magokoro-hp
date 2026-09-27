"use client";

import { useState, useEffect } from "react";

type Props = {
  igIndex: number;
  fallback: string;
  alt: string;
};

export function CaseImage({ igIndex, fallback, alt }: Props) {
  const [src, setSrc] = useState(fallback);

  useEffect(() => {
    fetch("/api/instagram/feed")
      .then((r) => (r.ok ? r.json() : []))
      .then((posts: { media_url: string; thumbnail_url?: string; media_type: string }[]) => {
        const post = posts[igIndex];
        if (post) {
          setSrc(
            post.media_type === "VIDEO" && post.thumbnail_url
              ? post.thumbnail_url
              : post.media_url
          );
        }
      })
      .catch(() => {});
  }, [igIndex]);

  return (
    <div
      style={{
        aspectRatio: "4/3",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 40,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
