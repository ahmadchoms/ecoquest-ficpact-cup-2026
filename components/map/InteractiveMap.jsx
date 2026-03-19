"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useUserStore } from "@/store/useUserStore";
import {
  TILE_URL,
  TILE_ATTRIBUTION,
  MAP_CENTER,
  MAP_ZOOM,
  PROGRESS_COLORS,
} from "@/utils/constants";
import "leaflet/dist/leaflet.css";

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMap({
  provinces: filteredProvinces,
  allProvinces = [],
  onProvinceClick,
}) {
  const [geoData, setGeoData] = useState(null);
  const geoRef = useRef(null);
  const { getProvinceProgress, exploredProvinces, completedMissions } =
    useUserStore();

  useEffect(() => {
    fetch("/data/indonesia.geojson")
      .then((res) => res.json())
      .then(setGeoData)
      .catch(console.error);
  }, []);

  const filteredIds = useMemo(
    () => new Set(filteredProvinces.map((p) => p.id)),
    [filteredProvinces],
  );

  const provinceIdMap = useMemo(() => {
    if (!geoData || !allProvinces.length) return new Map();

    const map = new Map();
    geoData.features.forEach((feature) => {
      const props = feature.properties;
      const name = (
        props.name ||
        props.NAME_1 ||
        props.Propinsi ||
        ""
      ).toLowerCase();

      if (!name) return;

      let matchedId = null;
      for (const p of allProvinces) {
        const pName = p.name.toLowerCase();
        const pId = p.id.toLowerCase();

        if (
          name === pName ||
          name.includes(pName) ||
          pName.includes(name) ||
          name.replace(/\s+/g, "-") === pId ||
          name.replace(/\s+/g, "") === pName.replace(/\s+/g, "")
        ) {
          matchedId = p.id;
          break;
        }
      }

      if (!matchedId) {
        const nameNorm = name.replace(/\s+/g, "").replace(/-/g, "");
        for (const p of allProvinces) {
          const pNorm = p.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/-/g, "");
          if (nameNorm.includes(pNorm) || pNorm.includes(nameNorm)) {
            matchedId = p.id;
            break;
          }
        }
      }

      map.set(name, matchedId);
    });
    return map;
  }, [geoData, allProvinces]);

  const getProvinceId = useCallback(
    (feature) => {
      const props = feature.properties;
      const name = (
        props.name ||
        props.NAME_1 ||
        props.Propinsi ||
        ""
      ).toLowerCase();
      return provinceIdMap.get(name);
    },
    [provinceIdMap],
  );

  const getStyleForProvince = useCallback(
    (provinceId) => {
      if (!provinceId || !filteredIds.has(provinceId)) {
        return {
          fillColor: "#e5e7eb",
          weight: 1,
          color: "#d1d5db",
          fillOpacity: 0.3,
        };
      }

      const province = allProvinces.find((p) => p.id === provinceId);
      const progress = getProvinceProgress(
        provinceId,
        province?.missionsCount || 3,
      );

      let fillColor = PROGRESS_COLORS.notStarted;
      if (progress === 100) fillColor = PROGRESS_COLORS.completed;
      else if (progress > 0) fillColor = PROGRESS_COLORS.inProgress;

      return {
        fillColor,
        weight: 1.5,
        color: "#ffffff",
        fillOpacity: 0.7,
      };
    },
    [filteredIds, allProvinces, getProvinceProgress],
  );

  const style = useCallback(
    (feature) => {
      const provinceId = getProvinceId(feature);
      return getStyleForProvince(provinceId);
    },
    [getProvinceId, getStyleForProvince],
  );

  useEffect(() => {
    if (geoRef.current && geoData) {
      geoRef.current.eachLayer((layer) => {
        const provinceId = getProvinceId(layer.feature);
        const newStyle = getStyleForProvince(provinceId);
        layer.setStyle(newStyle);
      });
    }
  }, [
    exploredProvinces,
    completedMissions,
    filteredIds,
    geoData,
    getProvinceId,
    getStyleForProvince,
  ]);

  const onEachFeature = useCallback(
    (feature, layer) => {
      const provinceId = getProvinceId(feature);
      if (!provinceId) return;

      const province = allProvinces.find((p) => p.id === provinceId);
      if (!province) return;

      const progress = getProvinceProgress(
        provinceId,
        province.missionsCount || 0,
      );

      layer.bindTooltip(
        `<div style="font-family:Poppins,sans-serif;padding:4px 0">
        <strong>${province.illustration || "🗺️"} ${province.name}</strong><br/>
        <span style="color:#6b7280;font-size:11px">${province.region || "Indonesia"} · Progress: ${progress}%</span>
      </div>`,
        { sticky: true, className: "province-tooltip" },
      );

      layer.on({
        mouseover: (e) => {
          e.target.setStyle({
            weight: 3,
            color: "#22c55e",
            fillOpacity: 0.85,
          });
        },
        mouseout: (e) => {
          if (geoRef.current) {
            geoRef.current.resetStyle(e.target);
          }
        },
        click: () => {
          onProvinceClick?.(provinceId);
        },
      });
    },
    [getProvinceId, getProvinceProgress, onProvinceClick, allProvinces],
  );

  if (!geoData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="text-5xl animate-float mb-3">🗺️</div>
          <p className="text-sm text-gray-500">Memuat peta Indonesia...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
      attributionControl={false}
      minZoom={4}
      maxZoom={10}
      className="rounded-none"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <GeoJSON
        ref={geoRef}
        data={geoData}
        style={style}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
}
