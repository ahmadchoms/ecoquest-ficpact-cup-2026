import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useUserStore } from "../../store/useUserStore";
import { provinces } from "../../data/provinces";
import { TILE_URL, TILE_ATTRIBUTION, MAP_CENTER, MAP_ZOOM, PROGRESS_COLORS } from "../../utils/constants";
import "leaflet/dist/leaflet.css";

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMap({ provinces: filteredProvinces, onProvinceClick }) {
  const [geoData, setGeoData] = useState(null);
  const geoRef = useRef(null);
  const { getProvinceProgress, exploredProvinces, completedMissions } = useUserStore();

  useEffect(() => {
    fetch("/data/indonesia.geojson")
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Failed to load GeoJSON:", err));
  }, []);

  const filteredIds = useMemo(
    () => new Set(filteredProvinces.map(p => p.id)),
    [filteredProvinces]
  );

  const getProvinceId = useCallback((feature) => {
    const props = feature.properties;
    const name = (props.name || props.NAME_1 || props.Propinsi || props.state || "").toLowerCase();

    for (const p of provinces) {
      const pName = p.name.toLowerCase();
      const pId = p.id.toLowerCase();
      if (name.includes(pName) || pName.includes(name) ||
          name.replace(/\s+/g, '-') === pId ||
          name.replace(/\s+/g, '') === pName.replace(/\s+/g, '')) {
        return p.id;
      }
    }

    const nameNorm = name.replace(/\s+/g, '').replace(/-/g, '');
    for (const p of provinces) {
      const pNorm = p.name.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
      if (nameNorm.includes(pNorm) || pNorm.includes(nameNorm)) {
        return p.id;
      }
    }

    return null;
  }, []);

  const style = useCallback((feature) => {
    const provinceId = getProvinceId(feature);
    if (!provinceId || !filteredIds.has(provinceId)) {
      return {
        fillColor: '#e5e7eb',
        weight: 1,
        color: '#d1d5db',
        fillOpacity: 0.3,
      };
    }

    const province = provinces.find(p => p.id === provinceId);
    const progress = getProvinceProgress(provinceId, province?.missions?.length || 3);

    let fillColor = PROGRESS_COLORS.notStarted;
    if (progress === 100) fillColor = PROGRESS_COLORS.completed;
    else if (progress > 0) fillColor = PROGRESS_COLORS.inProgress;

    return {
      fillColor,
      weight: 1.5,
      color: '#ffffff',
      fillOpacity: 0.7,
    };
  }, [filteredIds, getProvinceProgress, getProvinceId, completedMissions]);

  const onEachFeature = useCallback((feature, layer) => {
    const provinceId = getProvinceId(feature);
    if (!provinceId) return;

    const province = provinces.find(p => p.id === provinceId);
    if (!province) return;

    const progress = getProvinceProgress(provinceId, province.missions.length);

    layer.bindTooltip(
      `<div style="font-family:Poppins,sans-serif;padding:4px 0">
        <strong>${province.illustration} ${province.name}</strong><br/>
        <span style="color:#6b7280;font-size:11px">${province.region} · Progress: ${progress}%</span>
      </div>`,
      { sticky: true, className: 'province-tooltip' }
    );

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 3,
          color: '#22c55e',
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
  }, [getProvinceId, getProvinceProgress, onProvinceClick, completedMissions]);

  // Force re-render GeoJSON on state changes
  const geoKey = useMemo(
    () => `geo-${completedMissions.length}-${exploredProvinces.length}-${filteredIds.size}`,
    [completedMissions.length, exploredProvinces.length, filteredIds.size]
  );

  if (!geoData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
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
        key={geoKey}
        ref={geoRef}
        data={geoData}
        style={style}
        onEachFeature={onEachFeature}
      />
      <style>{`
        .province-tooltip {
          background: white !important;
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
          padding: 8px 12px !important;
        }
        .province-tooltip::before {
          border-top-color: white !important;
        }
      `}</style>
    </MapContainer>
  );
}
