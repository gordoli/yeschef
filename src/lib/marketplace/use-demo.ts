"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "./store";

export function useDemo() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
