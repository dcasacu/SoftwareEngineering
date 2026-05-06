import { useState } from "react";
import { COLORS, createStyles } from "../../styles/theme";
import MarketMap from "./MarketMap";

const CATEGORIES = ["All", "Fruits & Veg", "Meat", "Fish", "Bakery", "Dairy", "Spices", "Flowers"];
const s = createStyles();

/**
 * Map View Tab
 * Shows interactive market map with search and category filtering
 * Allows customers to browse shops and reserve queue places
 */
export default function MapView({ shops, onSelectShop, userId }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = shops.filter((shop) => {
    const matchCat = category === "All" || shop.category === category;
    const matchSearch = shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Search Header */}
      <div style={{ padding: "16px 20px", display: "flex", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            style={{ ...s.input, paddingLeft: 42 }}
            placeholder="Search shops or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            ...s.btn(false, true),
            padding: "0 14px",
            background: showFilters ? COLORS.blueLight : COLORS.white,
            display: "flex", alignItems: "center", gap: 6
          }}
        >
          <span>⚙️</span>
          <span style={{ fontSize: 13 }}>Filters</span>
        </button>
      </div>

      {/* Filter Overlay / Categories */}
      {showFilters && (
        <div style={{
          padding: "0 20px 16px",
          display: "flex", gap: 8, overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                ...s.pill(
                  category === cat ? COLORS.white : COLORS.gray600,
                  category === cat ? COLORS.blue : COLORS.gray100
                ),
                cursor: "pointer", border: "none", whiteSpace: "nowrap",
                padding: "8px 16px", fontFamily: "inherit",
                fontWeight: category === cat ? 700 : 600,
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Market Map */}
      <MarketMap shops={filtered} onSelectShop={onSelectShop} userId={userId} />

      {/* Shop List */}
      <div style={{ padding: "0 20px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray400 }}>
            {filtered.length} SHOPS NEARBY
          </div>
        </div>

        {filtered.map((shop) => {
          const userInQueue = shop.queue.some((c) => c.id === userId);
          return (
            <div
              key={shop.id}
              style={{
                ...s.card,
                cursor: "pointer",
                border: userInQueue ? `2px solid ${COLORS.orange}` : `2px solid transparent`,
                transition: "transform 0.15s",
              }}
              onClick={() => onSelectShop(shop.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: COLORS.blueLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0,
                }}>
                  🥕
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.gray900 }}>
                    {shop.name}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.gray400 }}>{shop.category}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={s.pill(
                    shop.isOpen ? COLORS.green : COLORS.red,
                    shop.isOpen ? COLORS.greenLight : COLORS.redLight,
                  )}>
                    {shop.isOpen ? "Open" : "Closed"}
                  </span>
                  {shop.queue.length > 0 && (
                    <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 4 }}>
                      {shop.queue.length} in queue
                    </div>
                  )}
                  {userInQueue && (
                    <div style={{ fontSize: 11, color: COLORS.orange, fontWeight: 700, marginTop: 2 }}>
                      You're here!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
