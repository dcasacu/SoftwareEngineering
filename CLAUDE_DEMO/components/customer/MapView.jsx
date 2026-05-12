import { useState } from "react";
import { COLORS, createStyles, RADIUS, TYPOGRAPHY, TRANSITIONS } from "../../styles/theme";
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
          <label htmlFor="search-shops" className="visually-hidden">Buscar tiendas o categorías</label>
          <input
            id="search-shops"
            type="search"
            style={{ ...s.input, paddingLeft: 42 }}
            placeholder="Buscar tiendas o categorías..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar tiendas o categorías"
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 18,
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          aria-pressed={showFilters}
          aria-label="Mostrar filtros"
          style={{
            ...s.btnSecondary(true),
            padding: "0 14px",
            background: showFilters ? COLORS.primaryLight : COLORS.surface,
            display: "flex",
            alignItems: "center",
            gap: 6,
            borderColor: showFilters ? COLORS.primary : COLORS.border,
          }}
        >
          <span aria-hidden="true">⚙️</span>
          <span style={{ fontSize: 13 }}>Filtros</span>
        </button>
      </div>

      {showFilters && (
        <div
          role="group"
          aria-label="Filtrar por categoría"
          style={{
            padding: "0 20px 16px",
            display: "flex",
            gap: 8,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              style={{
                ...s.badge(
                  category === cat ? COLORS.white : COLORS.primary,
                  category === cat ? COLORS.primary : COLORS.primaryLight
                ),
                cursor: "pointer",
                border: "none",
                whiteSpace: "nowrap",
                padding: "8px 16px",
                fontFamily: "inherit",
                fontWeight: category === cat ? TYPOGRAPHY.weights.bold : TYPOGRAPHY.weights.semibold,
                transition: `all ${TRANSITIONS.fast}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <MarketMap shops={filtered} onSelectShop={onSelectShop} userId={userId} />

      <div style={{ padding: "0 20px", flex: 1 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12
        }}>
          <h2 style={{
            fontSize: TYPOGRAPHY.sizes.xs,
            fontWeight: TYPOGRAPHY.weights.bold,
            color: COLORS.textMuted,
            letterSpacing: 1,
            margin: 0,
          }}>
            {filtered.length} TIENDAS CERCANAS
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div style={{ ...s.card, textAlign: "center", padding: "32px 24px" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{
              fontWeight: TYPOGRAPHY.weights.bold,
              fontSize: TYPOGRAPHY.sizes.base,
              color: COLORS.text
            }}>
              No se encontraron tiendas
            </div>
            <div style={{
              fontSize: TYPOGRAPHY.sizes.sm,
              color: COLORS.textMuted,
              marginTop: 4
            }}>
              Prueba con otra búsqueda o categoría
            </div>
          </div>
        ) : (
          filtered.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              userId={userId}
              onClick={() => onSelectShop(shop.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
