import { useState, useEffect, useCallback } from "react";
import { COLORS, TYPOGRAPHY, SHADOWS, RADIUS, TRANSITIONS, createStyles } from "./styles/theme";

const s = createStyles();

// ─── Mock Data (Self-Contained for Portability) ─────────────────────────────
const CATEGORIES = ["All", "Fruits & Veg", "Meat", "Fish", "Bakery", "Dairy", "Spices", "Flowers"];

const DEMO_USER = {
  id: "demo-user",
  name: "You",
};

const OWNER_SHOP_ID = "shop1";

const INITIAL_SHOPS = [
  {
    id: "shop1", name: "Martí's Fruits", category: "Fruits & Veg", owner: "Joan Martí",
    description: "Fresh seasonal fruits and vegetables from local farms.",
    position: { x: 28, y: 22 }, isOpen: true, avgServiceTime: 4,
    queue: [
      { id: "c1", name: "Anna G.", position: 1 },
      { id: "c2", name: "Pere M.", position: 2 },
      { id: "c3", name: "Laia F.", position: 3 },
    ],
  },
  {
    id: "shop2", name: "Pep's Bakery", category: "Bakery", owner: "Josep Vila",
    description: "Traditional Catalan bread and pastries baked fresh daily.",
    position: { x: 55, y: 38 }, isOpen: true, avgServiceTime: 3,
    queue: [
      { id: "c5", name: "Maria T.", position: 1 },
    ],
  },
  {
    id: "shop3", name: "La Peixateria", category: "Fish", owner: "Rosa Puig",
    description: "Fresh daily catch from the Mediterranean coast.",
    position: { x: 70, y: 62 }, isOpen: true, avgServiceTime: 6,
    queue: [
      { id: "c7", name: "Jordi R.", position: 1 },
      { id: "c8", name: "Clara B.", position: 2 },
      { id: "c9", name: "Marc S.", position: 3 },
    ],
  },
  {
    id: "shop4", name: "Ca la Carnissera", category: "Meat", owner: "Montse Soler",
    description: "Quality local meats and homemade sausages.",
    position: { x: 40, y: 65 }, isOpen: false, avgServiceTime: 5,
    queue: [],
  },
  {
    id: "shop5", name: "Espècies del Món", category: "Spices", owner: "Ahmed Bensali",
    description: "Exotic spices and herbs from around the world.",
    position: { x: 18, y: 58 }, isOpen: true, avgServiceTime: 2,
    queue: [],
  },
  {
    id: "shop6", name: "Flors i Plantes", category: "Flowers", owner: "Núria Costa",
    description: "Beautiful flowers and plants for every occasion.",
    position: { x: 78, y: 28 }, isOpen: true, avgServiceTime: 3,
    queue: [],
  },
];

const DEMO_USER_ID = DEMO_USER.id;
const DEMO_USER_NAME = DEMO_USER.name;

// ─── Utility ───────────────────────────────────────────────────────────────────
const getWaitTime = (shop, position) =>
  Math.max(0, (position - 1) * shop.avgServiceTime);

const getUserQueueEntry = (shop) =>
  shop.queue.find((c) => c.id === DEMO_USER_ID);

const getCategoryEmoji = (cat) => ({
  "Fruits & Veg": "🥕", Meat: "🥩", Fish: "🐟",
  Bakery: "🥖", Dairy: "🧀", Spices: "🌶️", Flowers: "🌸",
})[cat] || "🛒";

// ─── LocalStorage Helpers ───────────────────────────────────────────────────────
const STORAGE_KEY = "lineup_app_state";

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Failed to load from localStorage:", e);
  }
  return null;
};

const saveToStorage = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save to localStorage:", e);
  }
};

const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to clear localStorage:", e);
  }
};



// ─── Components ──────────────────────────────────────────────────────────────
function Toast({ message, show, type = "default", icon }) {
  return (
    <div style={s.toast(show, type)}>
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      <span>{message}</span>
    </div>
  );
}

function SkeletonLine({ width = "100%", height = 16 }) {
  return <div style={{ ...s.skeleton, width, height, borderRadius: 8 }} />;
}

function SkeletonCircle({ size = 48 }) {
  return <div style={{ ...s.skeleton, ...s.skeletonCircle, width: size, height: size }} />;
}

function SkeletonCard() {
  return (
    <div style={s.card}>
      <div style={{ display: "flex", gap: 14 }}>
        <SkeletonCircle />
        <div style={{ flex: 1 }}>
          <SkeletonLine width="70%" height={18} />
          <div style={{ marginTop: 8 }}>
            <SkeletonLine width="50%" height={14} />
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <SkeletonLine width="100%" height={14} />
        <div style={{ marginTop: 6 }}>
          <SkeletonLine width="85%" height={14} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <div style={{ flex: 1 }}><SkeletonLine height={44} /></div>
        <div style={{ flex: 1 }}><SkeletonLine height={44} /></div>
      </div>
    </div>
  );
}

function SkeletonShopCard() {
  return (
    <div style={{
      ...s.card,
      display: "flex",
      gap: 16,
      padding: 16,
      marginBottom: 12,
      opacity: 0.7,
    }}>
      <SkeletonCircle size={56} />
      <div style={{ flex: 1 }}>
        <SkeletonLine width="65%" height={18} />
        <div style={{ marginTop: 6 }}>
          <SkeletonLine width="40%" height={14} />
        </div>
        <div style={{ marginTop: 12 }}>
          <SkeletonLine width="50%" height={32} />
        </div>
      </div>
    </div>
  );
}

function SkeletonMapView() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["All", "Fruits", "Bakery", "Fish"].map((_, i) => (
          <div key={i} style={{ ...s.skeleton, width: 70, height: 36, borderRadius: 20 }} />
        ))}
      </div>
      <div style={{ ...s.skeleton, height: 340, borderRadius: 28, marginBottom: 16 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

function PositionBadge({ position, total, avgServiceTime }) {
  return (
    <div style={{
      background: COLORS.primaryLight, borderRadius: 24, padding: "24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      border: `2px solid ${COLORS.primary}10`,
    }}>
      <div>
        <div style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: 600 }}>Your position</div>
        <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.primary, lineHeight: 1, marginTop: 4 }}>
          #{position}
        </div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 6 }}>of {total} in queue</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: 600 }}>Est. wait</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.accent, lineHeight: 1, marginTop: 4 }}>
          {getWaitTime({ avgServiceTime }, position)}m
        </div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 6 }}>minutes</div>
      </div>
    </div>
  );
}

function ShopQuickView({ shop, onSelect, onClose }) {
  const qLen = shop.queue.length;
  const userInQueue = shop.queue.some((c) => c.id === DEMO_USER_ID);

  return (
    <div style={{
      position: "absolute", bottom: "100%", left: "50%",
      transform: "translateX(-50%)", marginBottom: 16,
      background: COLORS.white, borderRadius: 28, padding: "20px",
      boxShadow: "0 15px 35px rgba(0,0,0,0.2)", width: 240, zIndex: 100,
      border: userInQueue ? `2px solid ${COLORS.accent}` : "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: 32 }}>{getCategoryEmoji(shop.category)}</div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ background: "#F0F2F5", border: "none", borderRadius: "50%", width: 32, height: 32, color: COLORS.textMuted, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      </div>
      <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.text }}>{shop.name}</div>
      <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 2 }}>{shop.category}</div>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, alignItems: "center" }}>
        <span style={s.badge(
          shop.isOpen ? COLORS.success : COLORS.error,
          shop.isOpen ? COLORS.successLight : COLORS.errorLight,
        )}>{shop.isOpen ? "Open" : "Closed"}</span>
        <span style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: 700 }}>
          {qLen} waiting
        </span>
      </div>

      <button
        style={{ ...s.btnPrimary(true), marginTop: 18, width: "100%", borderRadius: 14 }}
        onClick={(e) => { e.stopPropagation(); onSelect(shop.id); }}
      >
        Join or View →
      </button>
      
      <div style={{
        position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
        width: 0, height: 0, borderLeft: "12px solid transparent",
        borderRight: "12px solid transparent", borderTop: `12px solid ${COLORS.white}`,
      }} />
    </div>
  );
}

function MarketMap({ shops, onSelectShop }) {
  const [selectedPin, setSelectedPin] = useState(null);

  return (
    <div style={{
      margin: "0 20px 16px",
      background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.background} 50%, ${COLORS.surfaceWarm} 100%)`,
      borderRadius: 28, position: "relative", height: 340, overflow: "hidden",
      border: `2px solid ${COLORS.borderStrong}`, flexShrink: 0,
      boxShadow: "inset 0 4px 15px rgba(0,0,0,0.08)",
    }}>
      {[...Array(5)].map((_, i) => (
        <div key={`h${i}`} style={{ position: "absolute", left: 0, right: 0, top: `${(i + 1) * 20}%`, height: 1, background: "rgba(46,91,186,0.05)" }} />
      ))}
      {[...Array(5)].map((_, i) => (
        <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${(i + 1) * 20}%`, width: 1, background: "rgba(46,91,186,0.05)" }} />
      ))}

      {shops.map((shop) => {
        const isSelected = selectedPin === shop.id;
        const userInQueue = shop.queue.some((c) => c.id === DEMO_USER_ID);
        const qLen = shop.queue.length;

        return (
          <div
            key={shop.id}
            onClick={() => setSelectedPin(isSelected ? null : shop.id)}
            style={{
              position: "absolute", left: `${shop.position.x}%`, top: `${shop.position.y}%`,
              transform: "translate(-50%, -100%)", cursor: "pointer",
              zIndex: isSelected ? 10 : 2, transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            {isSelected && <ShopQuickView shop={shop} onSelect={onSelectShop} onClose={() => setSelectedPin(null)} />}
            <div style={{
              background: userInQueue ? COLORS.accent : (shop.isOpen ? COLORS.primary : COLORS.textMuted),
              borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
              width: isSelected ? 52 : 44, height: isSelected ? 52 : 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: isSelected ? "0 12px 28px rgba(0,0,0,0.25)" : "0 6px 15px rgba(0,0,0,0.15)",
              transition: "all 0.2s", border: `3.5px solid ${COLORS.white}`,
            }}>
              <span style={{ transform: "rotate(45deg)", fontSize: isSelected ? 24 : 20 }}>
                {getCategoryEmoji(shop.category)}
              </span>
            </div>
            {qLen > 0 && !isSelected && (
              <div style={{
                position: "absolute", top: -6, right: -6, background: COLORS.accent, color: COLORS.white,
                borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, border: `2.5px solid ${COLORS.white}`, transform: "rotate(45deg)",
              }}>
                {qLen}
              </div>
            )}
          </div>
        );
      })}
      
      <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(255,255,255,0.98)", borderRadius: 14, padding: "10px 16px", fontSize: 11, color: COLORS.textSecondary, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.accent }} />
          <span style={{ fontWeight: 700 }}>Your active queues</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.primary }} />
          <span style={{ fontWeight: 700 }}>Open shops</span>
        </div>
      </div>
    </div>
  );
}

function MyQueues({ shops, onLeaveQueue, onGoToShop }) {
  const myQueues = shops
    .filter((shop) => shop.queue.some((c) => c.id === DEMO_USER_ID))
    .map((shop) => {
      const entry = shop.queue.find((c) => c.id === DEMO_USER_ID);
      return { shop, entry };
    });

  if (myQueues.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <div style={s.sectionTitle}>My Queues</div>
        <div style={{ ...s.card, textAlign: "center", padding: "80px 24px", color: COLORS.textMuted }}>
          <div style={{ fontSize: 80, marginBottom: 24, opacity: 0.5 }}>🎫</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: COLORS.textSecondary }}>No active queues</div>
          <div style={{ fontSize: 15, marginTop: 10, maxWidth: 240, margin: "10px auto 0" }}>Browse the market map to find shops and join a queue.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={s.sectionTitle}>Active Tickets</div>
      {myQueues.map(({ shop, entry }) => (
        <div key={shop.id} style={{ ...s.card, border: `2.5px solid ${COLORS.primary}10` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.text }}>
                {getCategoryEmoji(shop.category)} {shop.name}
              </div>
              <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>{shop.category}</div>
            </div>
            <span style={s.badge(COLORS.success, COLORS.successLight)}>Active Now</span>
          </div>
          <PositionBadge position={entry.position} total={shop.queue.length} avgServiceTime={shop.avgServiceTime} />
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button style={{ ...s.btnPrimary(true), flex: 1.5 }} onClick={() => onGoToShop(shop.id)}>Go to Shop</button>
            <button style={{ ...s.btnDanger, flex: 1 }} onClick={() => onLeaveQueue(shop.id)}>Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MapView({ shops, onSelectShop }) {
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 20px", display: "flex", gap: 12 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input style={{ ...s.input, paddingLeft: 52 }} placeholder="Search for food or shops..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 22 }}>🔍</span>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} style={{ ...s.btnSecondary(true), padding: "0 18px", borderRadius: 18, background: showFilters ? COLORS.primaryLight : COLORS.white, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚙️</span><span style={{ fontSize: 15, fontWeight: 700 }}>Filter</span>
        </button>
      </div>

      {showFilters && (
        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ ...s.badge(category === cat ? COLORS.white : COLORS.textSecondary, category === cat ? COLORS.primary : COLORS.border), cursor: "pointer", border: "none", whiteSpace: "nowrap", padding: "12px 20px", fontWeight: 700, transition: "all 0.2s" }}>
              {cat}
            </button>
          ))}
        </div>
      )}

      <MarketMap shops={filtered} onSelectShop={onSelectShop} />

      <div style={{ padding: "0 20px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.textMuted, letterSpacing: 0.5 }}>{filtered.length} SHOPS AVAILABLE</div>
        </div>
        {filtered.map((shop) => {
          const userInQueue = shop.queue.some((c) => c.id === DEMO_USER_ID);
          return (
            <div key={shop.id} style={{ ...s.card, cursor: "pointer", transform: "translateZ(0)", border: userInQueue ? `2.5px solid ${COLORS.accent}` : `1px solid ${COLORS.border}` }} onClick={() => onSelectShop(shop.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 18, background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
                  {getCategoryEmoji(shop.category)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.text }}>{shop.name}</div>
                  <div style={{ fontSize: 14, color: COLORS.textMuted }}>{shop.category}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={s.badge(shop.isOpen ? COLORS.success : COLORS.error, shop.isOpen ? COLORS.successLight : COLORS.errorLight)}>{shop.isOpen ? "Open" : "Closed"}</span>
                  {shop.queue.length > 0 && <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 6, fontWeight: 600 }}>{shop.queue.length} in line</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShopDetail({ shop, onBack, onJoin, onLeave }) {
  const userEntry = getUserQueueEntry(shop);
  const qLen = shop.queue.length;

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, padding: "28px 24px 44px", borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 14, padding: "10px 18px", color: COLORS.white, cursor: "pointer", fontWeight: 700, marginBottom: 24 }}>← Back</button>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{getCategoryEmoji(shop.category)}</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.white }}>{shop.name}</div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", marginTop: 8, lineHeight: 1.5 }}>{shop.description}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <span style={s.badge(shop.isOpen ? COLORS.success : COLORS.error, shop.isOpen ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)")}>{shop.isOpen ? "● Open Now" : "● Closed"}</span>
          <span style={s.badge(COLORS.white, "rgba(255,255,255,0.25)")}>~{shop.avgServiceTime} min/person</span>
        </div>
      </div>

      <div style={{ padding: 24, marginTop: -20 }}>
        {userEntry && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.textSecondary, marginBottom: 12 }}>Your Place in Line</div>
            <PositionBadge position={userEntry.position} total={qLen} avgServiceTime={shop.avgServiceTime} />
          </div>
        )}

        <div style={s.card}>
          <div style={{ fontWeight: 800, color: COLORS.text, marginBottom: 20, fontSize: 17 }}>Queue Timeline</div>
          {qLen === 0 ? (
            <div style={{ color: COLORS.textMuted, fontSize: 15, textAlign: "center", padding: "32px 0" }}>Queue is empty. Join first!</div>
          ) : (
            shop.queue.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: i < qLen - 1 ? `1px solid ${COLORS.border}` : "none", background: c.id === DEMO_USER_ID ? COLORS.accentLight : "transparent", borderRadius: 12, paddingLeft: c.id === DEMO_USER_ID ? 12 : 0, paddingRight: c.id === DEMO_USER_ID ? 12 : 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: i === 0 ? COLORS.primary : COLORS.border, color: i === 0 ? COLORS.white : COLORS.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, marginRight: 16 }}>{c.position}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{c.id === DEMO_USER_ID ? "You 👋" : c.name}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted }}>~{getWaitTime(shop, c.position)} min wait</div>
                </div>
                {i === 0 && <span style={s.badge(COLORS.accent, COLORS.accentLight)}>Up Next</span>}
              </div>
            ))
          )}
        </div>

        {shop.isOpen ? (
          userEntry ? (
            <button style={{ ...s.btnDanger, width: "100%", marginTop: 12, borderRadius: 18, padding: "16px" }} onClick={onLeave}>Leave Queue</button>
          ) : (
            <button style={s.btnAccent()} onClick={onJoin}>Join Queue Now →</button>
          )
        ) : (
          <div style={{ ...s.card, textAlign: "center", color: COLORS.textMuted, background: COLORS.background, border: `1px dashed ${COLORS.borderStrong}`, padding: "32px 20px" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
            The owner has closed the queue.
          </div>
        )}
      </div>
    </div>
  );
}

function OwnerDashboard({ shop, onAdvance, onRemove, onToggleOpen }) {
  const qLen = shop.queue.length;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ ...s.card, background: COLORS.primary, color: COLORS.white, marginBottom: 24, padding: "32px 24px", borderRadius: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>{shop.name}</div>
            <div style={{ fontSize: 16, opacity: 0.85, marginTop: 4 }}>Control Center</div>
          </div>
          <span style={s.badge(shop.isOpen ? COLORS.success : COLORS.error, shop.isOpen ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)")}>
            {shop.isOpen ? "● Active" : "● Offline"}
          </span>
        </div>
      </div>

      <button style={{ ...(shop.isOpen ? s.btnDanger : s.btnAccent()), width: "100%", marginBottom: 32, fontSize: 17, padding: "20px", borderRadius: 20 }} onClick={onToggleOpen}>
        {shop.isOpen ? "🔒 Close Queue for Now" : "🟢 Open Queue to Public"}
      </button>

      <div style={s.sectionTitle}>Manage Queue ({qLen})</div>

      {qLen === 0 ? (
        <div style={{ ...s.card, textAlign: "center", color: COLORS.textMuted, padding: "64px 24px" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
          <div style={{ fontWeight: 900, color: COLORS.textSecondary, fontSize: 18 }}>Queue is Cleared</div>
          <div style={{ fontSize: 15, marginTop: 10 }}>Ready for the next rush.</div>
        </div>
      ) : (
        <>
          <div style={{ ...s.card, background: `linear-gradient(135deg, ${COLORS.accentLight}, #fff)`, border: `2.5px solid ${COLORS.accent}`, marginBottom: 20, padding: 24, borderRadius: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.accent, marginBottom: 10, letterSpacing: 1.5 }}>SERVE NOW</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.text }}>{shop.queue[0].name}</div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button style={{ ...s.btnAccent(true), flex: 2, borderRadius: 16 }} onClick={onAdvance}>✓ Call Next</button>
              <button style={{ ...s.btnDanger, flex: 1, borderRadius: 16 }} onClick={() => onRemove(shop.queue[0].id)}>Remove</button>
            </div>
          </div>

          {shop.queue.slice(1).map((customer) => (
            <div key={customer.id} style={{ ...s.card, display: "flex", alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: COLORS.border, color: COLORS.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, marginRight: 20 }}>{customer.position}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{customer.name}</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted }}>Waiting in line</div>
              </div>
              <button style={{ background: "#FEE2E2", border: "none", color: COLORS.error, cursor: "pointer", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => onRemove(customer.id)}>✕</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function ModeSelector({ onSelect }) {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.primary, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ marginBottom: 80, textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🛒</div>
        <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, letterSpacing: "-2px" }}>Line <span style={{ color: COLORS.accent }}>Up</span></div>
        <div style={{ color: "rgba(255,255,255,0.75)", marginTop: 16, fontSize: 20, fontWeight: 600 }}>Market Queueing Reimagined</div>
      </div>

      <div style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 800, letterSpacing: 2, textAlign: "center", marginBottom: 24, textTransform: "uppercase" }}>Select Experience</div>
        <button style={{ width: "100%", background: COLORS.white, border: "none", borderRadius: 32, padding: "28px", cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 24, textAlign: "left", fontFamily: "inherit", boxShadow: "0 15px 35px rgba(0,0,0,0.25)" }} onClick={() => onSelect("customer")}>
          <div style={{ fontSize: 48 }}>🧺</div>
          <div><div style={{ fontSize: 20, fontWeight: 900, color: COLORS.text }}>Customer</div><div style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>Find shops & join line</div></div>
        </button>
        <button style={{ width: "100%", background: COLORS.accent, border: "none", borderRadius: 32, padding: "28px", cursor: "pointer", display: "flex", alignItems: "center", gap: 24, textAlign: "left", fontFamily: "inherit", boxShadow: "0 15px 35px rgba(0,0,0,0.25)" }} onClick={() => onSelect("owner")}>
          <div style={{ fontSize: 48 }}>🏪</div>
          <div><div style={{ fontSize: 20, fontWeight: 900, color: COLORS.white }}>Shop Owner</div><div style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 4 }}>Manage your live queue</div></div>
        </button>
      </div>
      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, marginTop: 64, fontWeight: 700 }}>LineUp Project · ES 2026</div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function LineUpApp() {
  const savedState = loadFromStorage();
  
  const [mode, setMode] = useState(savedState?.mode ?? null); 
  const [shops, setShops] = useState(savedState?.shops ?? INITIAL_SHOPS);
  const [activeTab, setActiveTab] = useState(savedState?.activeTab ?? "map");
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "default", icon: null });

  useEffect(() => {
    const stateToSave = { mode, shops, activeTab };
    saveToStorage(stateToSave);
  }, [mode, shops, activeTab]);

  useEffect(() => {
    const randomNames = ["Emma L.", "Lucas P.", "Marta C.", "Joan R.", "Laia S.", "Pere T.", "Núria V.", "Jordi M."];
    
    const simulateQueueUpdates = () => {
      setShops((prevShops) => {
        return prevShops.map((shop) => {
          if (!shop.isOpen || shop.queue.length === 0) return shop;
          
          const shouldAdvance = Math.random() < 0.08;
          const shouldAddCustomer = Math.random() < 0.06;
          
          let newQueue = [...shop.queue];
          
          if (shouldAdvance && newQueue.length > 0) {
            newQueue = newQueue.slice(1);
          }
          
          if (shouldAddCustomer && newQueue.length < 8) {
            const newCustomerId = `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
            newQueue.push({
              id: newCustomerId,
              name: randomName,
              position: newQueue.length + 1,
            });
          }
          
          if (newQueue.length !== shop.queue.length) {
            return { ...shop, queue: newQueue.map((c, i) => ({ ...c, position: i + 1 })) };
          }
          
          return shop;
        });
      });
    };
    
    const interval = setInterval(simulateQueueUpdates, 4000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const simulateShopStatusChanges = () => {
      setShops((prevShops) => {
        const randomShopIndex = Math.floor(Math.random() * prevShops.length);
        const shop = prevShops[randomShopIndex];
        
        if (shop.queue.length > 0 && shop.isOpen) return prevShops;
        
        if (Math.random() < 0.15) {
          return prevShops.map((s, i) => 
            i === randomShopIndex ? { ...s, isOpen: !s.isOpen } : s
          );
        }
        
        return prevShops;
      });
    };
    
    const interval = setInterval(simulateShopStatusChanges, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const showToast = useCallback((msg, type = "default", icon = null) => {
    setToast({ show: true, message: msg, type, icon });
    setTimeout(() => setToast({ show: false, message: "", type: "default", icon: null }), 3000);
  }, []);

  const updateShop = (shopId, updater) => {
    setShops((prev) => prev.map((s) => s.id === shopId ? updater(s) : s));
  };

  const joinQueue = (shopId) => {
    const shop = shops.find((s) => s.id === shopId);
    if (!shop || !shop.isOpen) return;
    if (shop.queue.some((c) => c.id === DEMO_USER_ID)) {
      showToast("Already in queue!", "warning", "⚠️"); return;
    }
    updateShop(shopId, (s) => ({
      ...s, queue: [...s.queue, { id: DEMO_USER_ID, name: DEMO_USER_NAME, position: s.queue.length + 1 }],
    }));
    showToast("Successfully joined!", "success", "🎉"); setActiveTab("queues");
  };

  const cancelQueue = (shopId, userId) => {
    updateShop(shopId, (s) => ({
      ...s, queue: s.queue.filter((c) => c.id !== userId).map((c, i) => ({ ...c, position: i + 1 })),
    }));
    showToast(userId === DEMO_USER_ID ? "Left queue." : "Customer removed.", "default", userId === DEMO_USER_ID ? "👋" : "🗑️");
  };

  const ownerShop = shops.find((s) => s.id === OWNER_SHOP_ID);
  const selectedShop = shops.find((s) => s.id === selectedShopId);

  const toggleQueueStatus = () => {
    updateShop(OWNER_SHOP_ID, (s) => ({ ...s, isOpen: !s.isOpen }));
    showToast(ownerShop.isOpen ? "Queue Closed." : "Queue is now Open!", ownerShop.isOpen ? "warning" : "success", ownerShop.isOpen ? "🔒" : "🔓");
  };

  const advanceQueue = () => {
    if (!ownerShop || ownerShop.queue.length === 0) return;
    cancelQueue(OWNER_SHOP_ID, ownerShop.queue[0].id);
    showToast("Next customer called!", "success", "📢");
  };

  if (!mode) return <ModeSelector onSelect={setMode} />;

  const tabs = mode === "customer" ? [
    { id: "map", label: "Map View", icon: "🗺️" },
    { id: "queues", label: "My Tickets", icon: "🎫" }
  ] : [
    { id: "dashboard", label: "Dashboard", icon: "📊" }
  ];

  const renderContent = () => {
    if (mode === "owner") return <OwnerDashboard shop={ownerShop} onAdvance={advanceQueue} onRemove={(id) => cancelQueue(OWNER_SHOP_ID, id)} onToggleOpen={toggleQueueStatus} />;
    if (selectedShop) return <ShopDetail shop={selectedShop} onBack={() => setSelectedShopId(null)} onJoin={() => joinQueue(selectedShop.id)} onLeave={() => { cancelQueue(selectedShop.id, DEMO_USER_ID); setSelectedShopId(null); }} />;
    if (activeTab === "map") return <MapView shops={shops} onSelectShop={setSelectedShopId} />;
    if (activeTab === "queues") return <MyQueues shops={shops} onLeaveQueue={(id) => cancelQueue(id, DEMO_USER_ID)} onGoToShop={(id) => { setSelectedShopId(id); setActiveTab("map"); }} />;
  };

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🛒</span>
          <span style={s.logoText}>Line <span style={s.logoAccent}>Up</span></span>
          <span style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 4, 
            background: "rgba(255,255,255,0.15)", 
            borderRadius: 12, 
            padding: "3px 8px",
            fontSize: 10,
            fontWeight: 700,
            color: COLORS.white,
            marginLeft: 4,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#4ADE80",
              animation: "pulse 2s infinite",
            }} />
            LIVE
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={s.badge(COLORS.accent, "rgba(255,255,255,0.2)")}>{mode === "owner" ? "Owner" : "Guest"}</span>
          <button onClick={() => { clearStorage(); setMode(null); setShops(INITIAL_SHOPS); setActiveTab("map"); setSelectedShopId(null); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 14px", color: COLORS.white, cursor: "pointer", fontWeight: 800, fontSize: 13, transition: "all 0.2s" }}>Reset</button>
        </div>
      </div>
      <div style={s.content}>{renderContent()}</div>
      {!selectedShop && (
        <div style={s.navBar}>
          {tabs.map((tab) => (
            <button key={tab.id} style={s.navItem(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
              <span style={{ fontSize: 26 }}>{tab.icon}</span><span style={{ fontSize: 12 }}>{tab.label}</span>
            </button>
          ))}
        </div>
      )}
      <Toast message={toast.message} show={toast.show} type={toast.type} icon={toast.icon} />
    </div>
  );
}
