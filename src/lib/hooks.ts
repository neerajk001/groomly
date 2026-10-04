"use client";

import { useSyncExternalStore } from "react";
import * as store from "./store";
import type { DB } from "./types";

export function useDB(): DB {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    store.subscribe,
    store.getHydrated,
    store.getServerHydrated,
  );
}
