"use client";

import { useEffect, useRef, useState } from "react";
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
};

const VILLAGES = { latitude: 28.908, longitude: -81.985 };

export function LightTourMap({ visitor, line, stops, activeId, follow = false, onMoveStop, onOpenStop, onLocate, me = null }: Props) {
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
  const [ready, setReady] = useState(false);
  const [recenter, setRecenter] = useState(false);
  const [locating, setLocating] = useState(false);
  const draggable = Boolean(onMoveStop);
  const editable = Boolean(onOpenStop);
  followRef.current = follow;
  visitorRef.current = visitor;
  moveRef.current = onMoveStop;
  openRef.current = onOpenStop;

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
          const detail = [stop.address, stop.note].filter(Boolean).join(" — ");
          if (detail) marker.bindTooltip(detail, { sticky: true });
          bounds.push([stop.latitude, stop.longitude]);
        }
        const routeKey = `${stops.map((stop) => stop.id).join(",")}:${line.length}`;
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
  }, [visitor, line, stops, activeId, ready, follow, draggable, editable]);

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
    map.on("dragstart", onDrag);
    return () => {
      map.off("dragstart", onDrag);
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
    </div>
  );
}
