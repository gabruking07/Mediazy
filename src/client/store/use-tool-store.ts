"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ToolState = {
  favorites: string[];
  recent: string[];
  toggleFavorite: (slug: string) => void;
  markRecent: (slug: string) => void;
};

export const useToolStore = create<ToolState>()(
  persist(
    (set) => ({
      favorites: [],
      recent: [],
      toggleFavorite: (slug) =>
        set((state) => ({
          favorites: state.favorites.includes(slug)
            ? state.favorites.filter((item) => item !== slug)
            : [slug, ...state.favorites]
        })),
      markRecent: (slug) =>
        set((state) => ({
          recent: [slug, ...state.recent.filter((item) => item !== slug)].slice(0, 8)
        }))
    }),
    { name: "mediazy-tools" }
  )
);
