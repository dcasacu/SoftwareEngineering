import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCategoryEmoji } from "../../utils/queueHelpers";
import { COLORS } from "../../styles/theme";
import ShopQuickView from "./ShopQuickView";

const createShopIcon = (shop, isSelected, userInQueue) => {
  const size = isSelected ? 44 : 36;
  const bgColor = userInQueue ? COLORS.accent : (shop.isOpen ? COLORS.primary : COLORS.textMuted);
  const emoji = getCategoryEmoji(shop.category);
  
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${bgColor};
        border-radius: 50%;
        border: 3px solid ${COLORS.white};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: ${isSelected ? "0 8px 20px rgba(0,0,0,0.25)" : "0 4px 10px rgba(0,0,0,0.15)"};
        transform: ${isSelected ? "scale(1.1)" : "scale(1)"};
        transition: all 0.3s ease;
        cursor: pointer;
      ">
        <span style="font-size: ${isSelected ? 18 : 14}px;">${emoji}</span>
      </div>
      ${shop.queue.length > 0 && !isSelected ? `
        <div style="
          position: absolute;
          top: -5px;
          right: -5px;
          width: 18px;
          height: 18px;
          background: ${bgColor};
          color: ${COLORS.white};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
          border: 2px solid ${COLORS.white};
        ">${shop.queue.length}</div>
      ` : ""}
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

export default function MarketMap({ shops, onSelectShop, userId }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [selectedShop, setSelectedShop] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: [41.3851, 2.1734],
      zoom: 16,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    setMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    shops.forEach((shop) => {
      const userInQueue = shop.queue.some((c) => c.id === userId);
      const icon = createShopIcon(shop, selectedShop === shop.id, userInQueue);
      
      const marker = L.marker([shop.position.x / 10, shop.position.y / 10], { icon })
        .addTo(mapInstanceRef.current);

      marker.on("click", () => {
        setSelectedShop(prev => prev === shop.id ? null : shop.id);
      });

      markersRef.current[shop.id] = marker;
    });
  }, [shops, mapReady, userId]);

  useEffect(() => {
    if (!mapReady || !selectedShop) return;

    const shop = shops.find(s => s.id === selectedShop);
    if (shop && mapInstanceRef.current) {
      mapInstanceRef.current.setView([shop.position.x / 10, shop.position.y / 10], 17, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [selectedShop, shops, mapReady]);

  const handleShopSelect = (shopId) => {
    onSelectShop(shopId);
    setSelectedShop(null);
  };

  const currentSelectedShop = shops.find(s => s.id === selectedShop);

  return (
    <div style={{ position: "relative", margin: "0 20px 16px" }}>
      <div
        ref={mapRef}
        style={{
          height: 320,
          borderRadius: 24,
          overflow: "hidden",
          border: `2px solid ${COLORS.border}`,
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        }}
      />

      {currentSelectedShop && (
        <div style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "90%",
        }}>
          <ShopQuickView
            shop={currentSelectedShop}
            onSelect={handleShopSelect}
            onClose={() => setSelectedShop(null)}
            userId={userId}
          />
        </div>
      )}

      <div style={{
        position: "absolute",
        top: 12,
        left: 12,
        background: COLORS.white,
        borderRadius: 12,
        padding: "8px 12px",
        fontSize: 11,
        color: COLORS.textSecondary,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        zIndex: 1000,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.accent }} />
          <span style={{ fontWeight: 600 }}>Your queues</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.primary }} />
          <span style={{ fontWeight: 600 }}>Open shops</span>
        </div>
      </div>

      <div style={{
        position: "absolute",
        top: 12,
        right: 12,
        background: COLORS.white,
        borderRadius: 12,
        padding: "8px 12px",
        fontSize: 11,
        color: COLORS.textSecondary,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        zIndex: 1000,
      }}>
        <div style={{ fontWeight: 700 }}>{shops.length} shops</div>
      </div>
    </div>
  );
}
