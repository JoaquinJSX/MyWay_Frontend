// File: src/OrientationGuard.tsx
import React, { useEffect, useMemo, useRef } from "react";

/**
 * Force portrait only on *mobile devices* in landscape.
 * Desktop stays untouched even with small windows.
 */
export interface OrientationGuardProps {
  children: React.ReactNode;
}

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  const coarse = matchMedia("(hover: none) and (pointer: coarse)").matches;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";
  const uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  return coarse || uaMobile; // require mobile traits
}

const OrientationGuard: React.FC<OrientationGuardProps> = ({ children }) => {
  const frameRef = useRef<HTMLDivElement>(null); // outer fixed frame
  const rotorRef = useRef<HTMLDivElement>(null); // inner rotating wrapper

  const apply = useMemo(
    () => () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const landscape = vw > vh;
      const mobile = isMobileDevice();

      const frame = frameRef.current;
      const rotor = rotorRef.current;
      if (!frame || !rotor) return;

      if (mobile && landscape) {
        // Frame: capture viewport
        frame.style.position = "fixed";
        frame.style.inset = "0";
        frame.style.overflow = "hidden";
        frame.style.width = "100vw";
        frame.style.height = "100vh";

        // Rotor: rotate content to keep portrait geometry visible
        rotor.style.position = "absolute";
        rotor.style.top = "0";
        rotor.style.left = "0";
        rotor.style.width = `${vh}px`;
        rotor.style.height = `${vw}px`;
        rotor.style.transformOrigin = "top left";
        rotor.style.transform = "rotate(-90deg) translateX(-100%)";
      } else {
        // Reset completely for desktop/portrait
        frame.setAttribute("style", "");
        rotor.setAttribute("style", "");
      }
    },
    []
  );

  useEffect(() => {
    apply();
    const onResize = () => apply();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [apply]);

  return (
    <div ref={frameRef}>
      <div ref={rotorRef}>{children}</div>
    </div>
  );
};

export default OrientationGuard;
