"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

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
};

const VILLAGES = { latitude: 28.908, longitude: -81.985 };

export function LightTourMap({ visitor, line, stops, activeId }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const groupRef = useRef<import("leaflet").LayerGroup | null>(null);
  const fitted = useRef("");
  const [ready, setReady] = useState(false);

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
        if (line.length > 1) {
          L.polyline(line, { color: "#ffffff", weight: 8, opacity: 0.95 }).addTo(group);
          L.polyline(line, { color: "#0c4a6e", weight: 4, opacity: 0.95 }).addTo(group);
        }
        if (visitor) {
          L.circleMarker([visitor.latitude, visitor.longitude], {
            radius: 8,
            color: "#ffffff",
            weight: 3,
            fillColor: "#1f6b4a",
            fillOpacity: 1,
          }).addTo(group);
        }
        const bounds: [number, number][] = [];
        if (visitor) bounds.push([visitor.latitude, visitor.longitude]);
        for (const stop of stops) {
          const active = stop.id === activeId;
          const icon = L.divIcon({
            className: "lt-marker",
            html: `<span class="${active ? "is-active" : ""}">${stop.order}</span>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });
          const marker = L.marker([stop.latitude, stop.longitude], { icon, keyboard: true, title: `Stop ${stop.order}` }).addTo(group);
          const detail = [stop.address, stop.note].filter(Boolean).join(" — ");
          if (detail) marker.bindTooltip(detail, { sticky: true });
          bounds.push([stop.latitude, stop.longitude]);
        }
        const routeKey = `${stops.map((stop) => stop.id).join(",")}:${line.length}`;
        if (bounds.length && fitted.current !== routeKey) {
          fitted.current = routeKey;
          if (bounds.length > 1) map.fitBounds(bounds, { padding: [28, 28], maxZoom: 16 });
          else map.setView(bounds[0], 15);
        }
      });
    };
    timer = window.setTimeout(draw, 180);
    return () => window.clearTimeout(timer);
  }, [visitor, line, stops, activeId, ready]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      groupRef.current = null;
    };
  }, []);

  return (
    <div
      ref={host}
      className="lt-map"
      role="application"
      aria-label="Holiday Lights Tour map with numbered stops"
    />
  );
}
