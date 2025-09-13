// app/types.ts
import type { StaticImageData } from "next/image";

export type Track = {
  id: number;
  audioUrl: string;
  duration: number;
  listened: boolean;
  rating: number | null;
  downloaded: boolean;
  listenProgress: number; // 0-100
  revealed: boolean;
  score: number;
  rank?: number;

  // reveal metadata
  artist?: string;
  title?: string;
  albumArt?: string | StaticImageData;
  spotifyUrl?: string;
};

export type DemoState = "initial" | "some-revealed" | "end-of-day";

export type AppState = {
  tracks: Track[];
  selectedTrack: Track | null;
  showRecap: boolean;
  allTracksGone: boolean;
  showManifesto: boolean;
  showSubmission: boolean;
};