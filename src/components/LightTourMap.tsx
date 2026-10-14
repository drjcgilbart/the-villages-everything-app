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
};

const VILLAGES = { latitude: 28.908, longitude: -81.985 };

export function LightTourMap({ visitor, line, stops, activeId, follow = false, onMoveStop, onOpenStop }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const groupRef = useRef<import("leaflet").LayerGroup | null>(null);
  const fitted = useRef("");
  const followRef = useRef(follow);
  const userPanned = useRef(false);
  const visitorRef = useRef(visitor);
  const moveRef = useRef(onMoveStop);
  const openRef = useRef(onOpenStop);
  const [ready, setReady] = useState(false);
  const [recenter, setRecenter] = useState(false);
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
    const here = visitorRef.current;
    userPanned.current = false;
    setRecenter(false);
    if (!map || !here) return;
    const target: [number, number] = [here.latitude, here.longitude];
    if (map.getZoom() < 16) map.setView(target, 16, { animate: true });
    else map.panTo(target, { animate: true });
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
    </div>
  );
}
