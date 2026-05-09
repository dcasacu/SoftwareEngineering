import { useState } from "react";
import { COLORS, createStyles } from "../../styles/theme";
import MarketMap from "./MarketMap";
import ShopCard from "./ShopCard";

const CATEGORIES = ["All", "Fruits & Veg", "Meat", "Fish", "Bakery", "Dairy", "Spices", "Flowers"];
const s = createStyles();

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
            ...s.btnSecondary(true),
            padding: "0 14px",
            background: showFilters ? COLORS.primaryLight : COLORS.surface,
            display: "flex", alignItems: "center", gap: 6,
            borderColor: showFilters ? COLORS.primary : COLORS.border,
          }}
        >
          <span>⚙️</span>
          <span style={{ fontSize: 13 }}>Filters</span>
        </button>
      </div>

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
                ...s.badge(
                  category === cat ? COLORS.white : COLORS.primary,
                  category === cat ? COLORS.primary : COLORS.primaryLight
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

      <MarketMap shops={filtered} onSelectShop={onSelectShop} userId={userId} />

      <div style={{ padding: "0 20px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1 }}>
            {filtered.length} SHOPS NEARBY
          </div>
        </div>

        {filtered.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            userId={userId}
            onClick={() => onSelectShop(shop.id)}
          />
        ))}
      </div>
    </div>
  );
}
