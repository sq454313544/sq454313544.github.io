"use client";

import { useEffect } from "react";

export function LegacyResumeRedirect() {
  useEffect(() => {
    window.location.replace("/about/");
  }, []);

  return null;
}
