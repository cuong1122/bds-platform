"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useBuildings } from "@/features/listing/hooks";

// Import động, tắt SSR - Leaflet cần DOM/window
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export function MapView() {
  const { data: buildings, isLoading } = useBuildings();
  const [isClient, setIsClient] = useState(false);
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Fix icon mặc định của Leaflet bị lỗi path khi dùng với bundler
    import("leaflet").then((L) => {
      setIcon(
        new L.Icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      );
    });
  }, []);

  const validBuildings = buildings?.filter((b) => b.lat && b.lng) || [];

  if (!isClient || isLoading || !icon) {
    return (
      <div className="h-[480px] bg-black/5 flex items-center justify-center text-slate">
        Đang tải bản đồ...
      </div>
    );
  }

  if (validBuildings.length === 0) {
    return (
      <div className="h-[480px] bg-black/5 flex items-center justify-center text-slate">
        Chưa có tọa độ để hiển thị bản đồ
      </div>
    );
  }

  const center: [number, number] = [
    validBuildings[0].lat!,
    validBuildings[0].lng!,
  ];

  return (
    <div className="h-[480px] overflow-hidden">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validBuildings.map((building) => (
          <Marker
            key={building.id}
            position={[building.lat!, building.lng!]}
            icon={icon}
          >
            <Popup>
              <div className="font-medium">{building.name}</div>
              <div className="text-sm text-gray-500">{building.address}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
