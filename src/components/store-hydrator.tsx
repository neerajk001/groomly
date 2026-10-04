"use client";

import { useEffect } from "react";
import { hydrate } from "@/lib/store";

export function StoreHydrator() {
  useEffect(() => {
    hydrate();
  }, []);
  return null;
}
