"use client";

import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import "leaflet/dist/leaflet.css";
import { TOUR_START_MAX_METERS, haversineMeters } from "@/lib/lightTourShared";

type Stop = {
  id: string;
  order: number;
  latitude: number;
  longitude: number;
  address: string;
  note: string;
};

type Props = {
  visitor: { latitude: number; longitude: number } | null;
  line: [number, number][];
  stops: Stop[];
  activeId?: string;
  /** During a live tour, keep the green dot in view until the neighbor drags the map. */
  follow?: boolean;
  /** Admin only. Called with the pin id and the new GPS point after a drag. */
  onMoveStop?: (id: string, latitude: number, longitude: number) => void;
  /** Admin only. Called when a pin is double-clicked so its edit card can open. */
  onOpenStop?: (id: string) => void;
  /**
   * Shows the round locate button (bottom right). Called when the map has no
   * position yet; resolves with a fresh fix or null.
   */
  onLocate?: () => Promise<{ latitude: number; longitude: number } | null>;
  /**
   * Live "you are here" blue dot with an accuracy ring. Drawn on its own layer so
   * GPS ticks never redraw (or interrupt dragging) the numbered pins.
   */
  me?: { latitude: number; longitude: number; accuracy?: number } | null;
  /**
   * Admin only. Long-press (about half a second, touch or mouse) on a pin shows
   * a small "Go to pin" popup at the pin; tapping it calls this with the pin id.
   */
  onGoToStop?: (id: string) => void;
  /**
   * Extra floating buttons (for example the admin Drop pin). They stack in the
   * bottom-right corner under the locate button, so the two never overlap.
   */
  actions?: ReactNode;
  /** The bottom-right button stack, so a page can tell when it is on screen. */
  fabsRef?: Ref<HTMLDivElement>;
};

const LONG_PRESS_MS = 500;
/** Moving farther than this during the hold is a drag or pan, not a long-press. */
const LONG_PRESS_SLOP_PX = 8;

const VILLAGES = { latitude: 28.908, longitude: -81.985 };

/** A phone on its side. Matches the Holiday Lights landscape rules in globals.css. */
const LANDSCAPE_PHONE = "(orientation: landscape) and (max-height: 500px)";
const PORTRAIT_PHONE = "(orientation: portrait) and (max-width: 720px)";

export function LightTourMap({ visitor, line, stops, activeId, follow = false, onMoveStop, onOpenStop, onLocate, me = null, onGoToStop, actions, fabsRef }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const groupRef = useRef<import("leaflet").LayerGroup | null>(null);
  const meLayer = useRef<{
    ring: import("leaflet").Circle;
    dot: import("leaflet").CircleMarker;
  } | null>(null);
  const meNow = useRef<{ latitude: number; longitude: number } | null>(null);
  const fitted = useRef("");
  const followRef = useRef(follow);
  const userPanned = useRef(false);
  const visitorRef = useRef(visitor);
  const moveRef = useRef(onMoveStop);
  const openRef = useRef(onOpenStop);
  const goRef = useRef(onGoToStop);
  const goPopup = useRef<{ popup: import("leaflet").Popup; openedAt: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [recenter, setRecenter] = useState(false);
  const [locating, setLocating] = useState(false);
  const draggable = Boolean(onMoveStop);
  const editable = Boolean(onOpenStop);
  followRef.current = follow;
  visitorRef.current = visitor;
  moveRef.current = onMoveStop;
  openRef.current = onOpenStop;
  const canGo = Boolean(onGoToStop);
  useEffect(() => {
    goRef.current = onGoToStop;
  }, [onGoToStop]);

  useEffect(() => {
    let cancelled = false;
    const node = host.current;
    if (!node || mapRef.current) return;
    void import("leaflet").then((L) => {
      if (cancelled || !host.current || mapRef.current) return;
      const map = L.map(host.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([VILLAGES.latitude, VILLAGES.longitude], 12);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      groupRef.current = L.layerGroup().addTo(map);
      map.zoomControl.getContainer()?.setAttribute("aria-label", "Map zoom controls");
      mapRef.current = map;
      setReady(true);
      window.setTimeout(() => map.invalidateSize(), 200);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const group = groupRef.current;
    if (!map || !group) return;
    let timer = 0;
    const draw = () => {
      void import("leaflet").then((L) => {
        map.invalidateSize();
        group.clearLayers();
        const nearHouses = (latitude: number, longitude: number) =>
          !stops.length ||
          stops.some((stop) => haversineMeters(stop, { latitude, longitude }) <= TOUR_START_MAX_METERS);
        const localLine = line.filter(([latitude, longitude]) => nearHouses(latitude, longitude));
        if (localLine.length > 1) {
          L.polyline(localLine, { color: "#ffffff", weight: 8, opacity: 0.95 }).addTo(group);
          L.polyline(localLine, { color: "#0c4a6e", weight: 4, opacity: 0.95 }).addTo(group);
        }
        const showVisitor = !!visitor && nearHouses(visitor.latitude, visitor.longitude);
        if (visitor && showVisitor) {
          L.circleMarker([visitor.latitude, visitor.longitude], {
            radius: 8,
            color: "#ffffff",
            weight: 3,
            fillColor: "#1f6b4a",
            fillOpacity: 1,
          }).addTo(group);
        }
        const bounds: [number, number][] = [];
        if (visitor && showVisitor) bounds.push([visitor.latitude, visitor.longitude]);
        for (const stop of stops) {
          const active = stop.id === activeId;
          const icon = L.divIcon({
            className: "lt-marker",
            html: `<span class="${active ? "is-active" : ""}">${stop.order}</span>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });
          const canDrag = Boolean(moveRef.current);
          const canOpen = Boolean(openRef.current);
          const marker = L.marker([stop.latitude, stop.longitude], {
            icon,
            keyboard: true,
            draggable: canDrag,
            autoPan: canDrag,
            title: canOpen
              ? `Stop ${stop.order}. Drag to move this house. Double-click to edit.`
              : `Stop ${stop.order}`,
          }).addTo(group);
          if (canDrag) {
            marker.on("dragend", () => {
              const at = marker.getLatLng();
              moveRef.current?.(stop.id, at.lat, at.lng);
            });
          }
          if (canOpen) {
            marker.on("dblclick", (event) => {
              L.DomEvent.stop(event);
              openRef.current?.(stop.id);
            });
          }
          if (goRef.current) {
            let timer = 0;
            let startX = 0;
            let startY = 0;
            const cancel = () => {
              window.clearTimeout(timer);
              timer = 0;
            };
            const showGo = () => {
              timer = 0;
              const button = document.createElement("button");
              button.type = "button";
              button.className = "lt-goto-btn";
              button.textContent = "Go to pin";
              button.setAttribute("aria-label", `Go to pin ${stop.order}`);
              L.DomEvent.disableClickPropagation(button);
              button.addEventListener("click", (event) => {
                event.preventDefault();
                map.closePopup();
                goPopup.current = null;
                goRef.current?.(stop.id);
              });
              const popup = L.popup({
                className: "lt-goto-pop",
                closeButton: false,
                closeOnClick: false,
                autoClose: true,
                autoPan: false,
                offset: [0, -14],
              })
                .setLatLng(marker.getLatLng())
                .setContent(button);
              map.openPopup(popup);
              goPopup.current = { popup, openedAt: Date.now() };
              marker.closeTooltip();
              if (typeof navigator !== "undefined") navigator.vibrate?.(15);
            };
            const el = marker.getElement();
            if (el) {
              el.addEventListener("pointerdown", (event) => {
                if (event.pointerType === "mouse" && event.button !== 0) return;
                startX = event.clientX;
                startY = event.clientY;
                cancel();
                timer = window.setTimeout(showGo, LONG_PRESS_MS);
              });
              el.addEventListener("pointermove", (event) => {
                if (!timer) return;
                if (Math.hypot(event.clientX - startX, event.clientY - startY) > LONG_PRESS_SLOP_PX) cancel();
              });
              el.addEventListener("pointerup", cancel);
              el.addEventListener("pointercancel", cancel);
              el.addEventListener("pointerleave", cancel);
              // A phone long-press otherwise opens the browser's own menu.
              el.addEventListener("contextmenu", (event) => event.preventDefault());
            }
            marker.on("dragstart", () => {
              cancel();
              if (goPopup.current) map.closePopup(goPopup.current.popup);
              goPopup.current = null;
            });
          }
          const detail = [stop.address, stop.note].filter(Boolean).join(" — ");
          if (detail) marker.bindTooltip(detail, { sticky: true });
          bounds.push([stop.latitude, stop.longitude]);
        }
        // On the admin map a Go to pin line must not re-zoom to every pin.
        const routeKey = `${stops.map((stop) => stop.id).join(",")}:${openRef.current ? "" : line.length}`;
        const tracking = followRef.current && !!visitor && showVisitor && !userPanned.current;
        if (bounds.length && fitted.current !== routeKey) {
          fitted.current = routeKey;
          if (!followRef.current) {
            if (bounds.length > 1) map.fitBounds(bounds, { padding: [28, 28], maxZoom: 16 });
            else map.setView(bounds[0], 15);
          }
        }
        if (tracking && visitor) {
          const target: [number, number] = [visitor.latitude, visitor.longitude];
          if (map.getZoom() < 16) map.setView(target, 16, { animate: true });
          else map.panTo(target, { animate: true });
        }
      });
    };
    timer = window.setTimeout(draw, 180);
    return () => window.clearTimeout(timer);
  }, [visitor, line, stops, activeId, ready, follow, draggable, editable, canGo]);

  useEffect(() => {
    if (!follow) return;
    userPanned.current = false;
    setRecenter(false);
  }, [follow]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onDrag = () => {
      if (!followRef.current) return;
      userPanned.current = true;
      setRecenter(true);
    };
    // The Go to pin popup closes on a tap elsewhere, but not on the release of
    // the long-press that opened it.
    const onMapClick = () => {
      const open = goPopup.current;
      if (!open || Date.now() - open.openedAt < 400) return;
      map.closePopup(open.popup);
      goPopup.current = null;
    };
    map.on("dragstart", onDrag);
    map.on("click", onMapClick);
    return () => {
      map.off("dragstart", onDrag);
      map.off("click", onMapClick);
    };
  }, [ready]);

  function centerOnVisitor() {
    const map = mapRef.current;
    const here = visitorRef.current || meNow.current;
    userPanned.current = false;
    setRecenter(false);
    if (!map || !here) return;
    const target: [number, number] = [here.latitude, here.longitude];
    if (map.getZoom() < 16) map.setView(target, 16, { animate: true });
    else map.panTo(target, { animate: true });
  }

  useEffect(() => {
    meNow.current = me ? { latitude: me.latitude, longitude: me.longitude } : null;
    const map = mapRef.current;
    if (!map) return;
    if (!me) {
      meLayer.current?.ring.remove();
      meLayer.current?.dot.remove();
      meLayer.current = null;
      return;
    }
    const at: [number, number] = [me.latitude, me.longitude];
    const radius = Math.max(5, Math.min(500, Number(me.accuracy) || 0));
    if (meLayer.current) {
      meLayer.current.ring.setLatLng(at).setRadius(radius);
      meLayer.current.dot.setLatLng(at);
      return;
    }
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !mapRef.current || meLayer.current) return;
      const ring = L.circle(at, {
        radius,
        color: "#1a73e8",
        weight: 1,
        opacity: 0.5,
        fillColor: "#1a73e8",
        fillOpacity: 0.15,
        interactive: false,
      }).addTo(mapRef.current);
      const dot = L.circleMarker(at, {
        radius: 8,
        color: "#ffffff",
        weight: 3,
        fillColor: "#1a73e8",
        fillOpacity: 1,
        interactive: false,
      }).addTo(mapRef.current);
      dot.bringToFront();
      meLayer.current = { ring, dot };
    });
    return () => {
      cancelled = true;
    };
  }, [me, ready]);

  // Turning a phone on its side (or starting the drive while it is sideways)
  // brings the whole map into view, since landscape is the driving view. On a
  // phone held upright, starting the drive lifts the map above the stop card.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const sideways = window.matchMedia(LANDSCAPE_PHONE);
    const upright = window.matchMedia(PORTRAIT_PHONE);
    let settle = 0;
    const scrollToMap = (behavior: ScrollBehavior) => {
      const wrap = host.current?.parentElement;
      if (!wrap) return;
      const header = document.querySelector<HTMLElement>(".site-header");
      const stuck = header && getComputedStyle(header).position === "sticky" ? header.getBoundingClientRect().height : 0;
      const off = wrap.getBoundingClientRect().top - stuck - 6;
      if (Math.abs(off) > 3) window.scrollTo({ top: Math.max(0, window.scrollY + off), behavior });
    };
    const fill = () => {
      scrollToMap("smooth");
      // The page can still be settling (a new sheet, the rotation itself), so check once more.
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        mapRef.current?.invalidateSize();
        scrollToMap("auto");
      }, 600);
    };
    const onTurn = () => {
      if (sideways.matches) fill();
    };
    if (follow && (sideways.matches || upright.matches)) fill();
    sideways.addEventListener("change", onTurn);
    return () => {
      window.clearTimeout(settle);
      sideways.removeEventListener("change", onTurn);
    };
  }, [follow]);

  async function locate() {
    if (locating) return;
    const known = visitorRef.current || meNow.current;
    if (known) {
      centerOnVisitor();
      return;
    }
    if (!onLocate) return;
    setLocating(true);
    try {
      const point = await onLocate();
      const map = mapRef.current;
      if (!point || !map) return;
      userPanned.current = false;
      setRecenter(false);
      const target: [number, number] = [point.latitude, point.longitude];
      map.setView(target, Math.max(map.getZoom(), 16), { animate: true });
    } finally {
      setLocating(false);
    }
  }

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      groupRef.current = null;
    };
  }, []);

  return (
    <div className="lt-map-wrap">
      <div
        ref={host}
        className="lt-map"
        role="application"
        aria-label={
          draggable
            ? "Holiday Lights map. Drag a number to move that house. Double-click a number to edit it."
            : "Holiday Lights Tour map with numbered stops"
        }
      />
      {recenter && follow ? (
        <button type="button" className="lt-recenter" onClick={centerOnVisitor}>
          Center on me
        </button>
      ) : null}
      {onLocate || actions ? (
        <div className="lt-map-fabs" ref={fabsRef}>
          {onLocate ? (
            <button
              type="button"
              className={`lt-locate${locating ? " is-busy" : ""}`}
              onClick={() => void locate()}
              aria-label="Center the map on my location"
              title="Center on my location"
              disabled={locating}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M12 1.5v3.5M12 19v3.5M1.5 12H5M19 12h3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
          {actions}
        </div>
      ) : null}
    </div>
  );
}
