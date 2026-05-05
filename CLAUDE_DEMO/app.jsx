import { useState, useEffect, useCallback } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  blue: "#2E5BBA",
  blueDark: "#1A3A8A",
  blueLight: "#EEF3FF",
  orange: "#F47A20",
  orangeLight: "#FFF3E8",
  white: "#FFFFFF",
  gray50: "#F8F9FA",
  gray100: "#F0F2F5",
  gray200: "#E0E4EA",
  gray400: "#9BA3B0",
  gray600: "#5A6472",
  gray900: "#1A1D23",
  green: "#22C55E",
  greenLight: "#DCFCE7",
  red: "#EF4444",
  redLight: "#FEE2E2",
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Fruits & Veg", "Meat", "Fish", "Bakery", "Dairy", "Spices", "Flowers"];

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

const DEMO_USER_ID = "demo-user";
const DEMO_USER_NAME = "You";
const OWNER_SHOP_ID = "shop1";

// ─── Utility ───────────────────────────────────────────────────────────────────
const getWaitTime = (shop, position) =>
  Math.max(0, (position - 1) * shop.avgServiceTime);

const getUserQueueEntry = (shop) =>
  shop.queue.find((c) => c.id === DEMO_USER_ID);

const getCategoryEmoji = (cat) => ({
  "Fruits & Veg": "🥕", Meat: "🥩", Fish: "🐟",
  Bakery: "🥖", Dairy: "🧀", Spices: "🌶️", Flowers: "🌸",
})[cat] || "🛒";

// ─── Styles helper ─────────────────────────────────────────────────────────────
const s = {
  // Layout
  app: {
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    background: COLORS.gray50,
    minHeight: "100vh",
    maxWidth: 430,
    margin: "0 auto",
    position: "relative",
    boxShadow: "0 0 40px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: COLORS.blue,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 800,
    color: COLORS.white,
    letterSpacing: "-0.5px",
  },
  logoUp: { color: COLORS.orange },
  content: { flex: 1, overflowY: "auto", paddingBottom: 80 },
  navBar: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: 430,
    background: COLORS.white,
    borderTop: `1px solid ${COLORS.gray200}`,
    display: "flex",
    zIndex: 100,
  },
  navItem: (active) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 4px 8px",
    cursor: "pointer",
    color: active ? COLORS.blue : COLORS.gray400,
    fontWeight: active ? 700 : 500,
    fontSize: 11,
    gap: 3,
    transition: "color 0.15s",
    background: "none",
    border: "none",
  }),
  // Cards
  card: {
    background: COLORS.white,
    borderRadius: 16,
    padding: "16px",
    marginBottom: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  pill: (color, bg) => ({
    display: "inline-block",
    background: bg,
    color: color,
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 700,
  }),
  btn: (primary = true, small = false) => ({
    background: primary ? COLORS.blue : COLORS.white,
    color: primary ? COLORS.white : COLORS.blue,
    border: primary ? "none" : `2px solid ${COLORS.blue}`,
    borderRadius: 12,
    padding: small ? "8px 16px" : "13px 20px",
    fontWeight: 700,
    fontSize: small ? 13 : 15,
    cursor: "pointer",
    width: primary && !small ? "100%" : "auto",
    fontFamily: "inherit",
    transition: "opacity 0.15s, transform 0.1s",
  }),
  btnOrange: (small = false) => ({
    background: COLORS.orange,
    color: COLORS.white,
    border: "none",
    borderRadius: 12,
    padding: small ? "8px 16px" : "13px 20px",
    fontWeight: 700,
    fontSize: small ? 13 : 15,
    cursor: "pointer",
    width: small ? "auto" : "100%",
    fontFamily: "inherit",
  }),
  btnDanger: {
    background: COLORS.redLight,
    color: COLORS.red,
    border: "none",
    borderRadius: 12,
    padding: "8px 16px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: `2px solid ${COLORS.gray200}`,
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    color: COLORS.gray900,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: COLORS.gray900,
    marginBottom: 12,
  },
  toast: (show) => ({
    position: "fixed",
    bottom: 90,
    left: "50%",
    transform: `translateX(-50%) translateY(${show ? 0 : 20}px)`,
    opacity: show ? 1 : 0,
    background: COLORS.gray900,
    color: COLORS.white,
    padding: "12px 24px",
    borderRadius: 24,
    fontWeight: 700,
    fontSize: 14,
    zIndex: 999,
    transition: "all 0.3s",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    maxWidth: 350,
    textAlign: "center",
  }),
};

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, show }) {
  return <div style={s.toast(show)}>{message}</div>;
}

// ─── Mode Selector ────────────────────────────────────────────────────────────
function ModeSelector({ onSelect }) {
  return (
    <div style={{
      minHeight: "100vh", background: COLORS.blue, display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 32, maxWidth: 430, margin: "0 auto",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🛒</div>
        <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.white, letterSpacing: "-1px" }}>
          Line <span style={{ color: COLORS.orange }}>Up</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", marginTop: 8, fontSize: 16 }}>
          Smart market queues
        </div>
      </div>

      <div style={{ width: "100%", marginBottom: 16 }}>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textAlign: "center", marginBottom: 16, textTransform: "uppercase" }}>
          Choose your mode
        </div>
        <button
          style={{
            width: "100%", background: COLORS.white, border: "none",
            borderRadius: 20, padding: "22px 24px", cursor: "pointer",
            marginBottom: 12, display: "flex", alignItems: "center", gap: 16,
            textAlign: "left", fontFamily: "inherit",
          }}
          onClick={() => onSelect("customer")}
        >
          <div style={{ fontSize: 36 }}>🧺</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.gray900 }}>Customer</div>
            <div style={{ fontSize: 13, color: COLORS.gray600, marginTop: 2 }}>Browse shops, join queues, track your turn</div>
          </div>
        </button>
        <button
          style={{
            width: "100%", background: COLORS.orange, border: "none",
            borderRadius: 20, padding: "22px 24px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 16,
            textAlign: "left", fontFamily: "inherit",
          }}
          onClick={() => onSelect("owner")}
        >
          <div style={{ fontSize: 36 }}>🏪</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.white }}>Shop Owner</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>Manage your queue & serving turns</div>
          </div>
        </button>
      </div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 16 }}>
        Demo mode · No login required
      </div>
    </div>
  );
}

// ─── Queue Position Badge ─────────────────────────────────────────────────────
function PositionBadge({ position, total }) {
  return (
    <div style={{
      background: COLORS.blueLight, borderRadius: 16, padding: "16px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      border: `2px solid ${COLORS.blue}22`,
    }}>
      <div>
        <div style={{ fontSize: 13, color: COLORS.gray600, fontWeight: 600 }}>Your position</div>
        <div style={{ fontSize: 38, fontWeight: 900, color: COLORS.blue, lineHeight: 1 }}>
          #{position}
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 2 }}>of {total} in queue</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, color: COLORS.gray600, fontWeight: 600 }}>Est. wait</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.orange, lineHeight: 1 }}>
          {getWaitTime({ avgServiceTime: 4 }, position)}m
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 2 }}>minutes</div>
      </div>
    </div>
  );
}

// ─── Customer: My Queues ──────────────────────────────────────────────────────
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
        <div style={{
          ...s.card, textAlign: "center", padding: "48px 24px",
          color: COLORS.gray400,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.gray600 }}>No active queues</div>
          <div style={{ fontSize: 14, marginTop: 8 }}>Go to the Map tab to browse shops and join a queue.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={s.sectionTitle}>My Queues</div>
      {myQueues.map(({ shop, entry }) => (
        <div key={shop.id} style={{ ...s.card, border: `2px solid ${COLORS.blueLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.gray900 }}>
                {getCategoryEmoji(shop.category)} {shop.name}
              </div>
              <div style={{ fontSize: 13, color: COLORS.gray400, marginTop: 2 }}>{shop.category}</div>
            </div>
            <span style={s.pill(COLORS.green, COLORS.greenLight)}>Active</span>
          </div>

          <PositionBadge
            position={entry.position}
            total={shop.queue.length}
          />

          {/* Progress bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{
              height: 6, background: COLORS.gray100, borderRadius: 3, overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${Math.max(10, ((shop.queue.length - entry.position + 1) / shop.queue.length) * 100)}%`,
                background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.orange})`,
                borderRadius: 3,
                transition: "width 0.5s",
              }} />
            </div>
            <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 4 }}>
              {shop.queue.length - entry.position} people ahead of you
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button style={{ ...s.btn(true, true), flex: 1 }} onClick={() => onGoToShop(shop.id)}>
              View Shop
            </button>
            <button style={s.btnDanger} onClick={() => onLeaveQueue(shop.id)}>
              Leave
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Customer: Map View ───────────────────────────────────────────────────────
function MapView({ shops, onSelectShop }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedPin, setSelectedPin] = useState(null);

  const filtered = shops.filter((shop) => {
    const matchCat = category === "All" || shop.category === category;
    const matchSearch = shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handlePinClick = (shopId) => {
    setSelectedPin(selectedPin === shopId ? null : shopId);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Search */}
      <div style={{ padding: "16px 20px 0" }}>
        <input
          style={s.input}
          placeholder="🔍  Search shops..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div style={{
        display: "flex", gap: 8, padding: "12px 20px",
        overflowX: "auto", scrollbarWidth: "none",
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
              cursor: "pointer",
              border: "none",
              whiteSpace: "nowrap",
              padding: "6px 14px",
              fontFamily: "inherit",
              fontWeight: category === cat ? 700 : 600,
              transition: "all 0.15s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Map */}
      <div style={{
        margin: "0 20px 16px",
        background: `linear-gradient(135deg, #e8f0fe 0%, #dbeafe 50%, #eff6ff 100%)`,
        borderRadius: 20,
        position: "relative",
        height: 260,
        overflow: "hidden",
        border: `2px solid ${COLORS.gray200}`,
        flexShrink: 0,
      }}>
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <div key={`h${i}`} style={{
            position: "absolute", left: 0, right: 0,
            top: `${(i + 1) * 20}%`, height: 1,
            background: "rgba(46,91,186,0.08)",
          }} />
        ))}
        {[...Array(5)].map((_, i) => (
          <div key={`v${i}`} style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${(i + 1) * 20}%`, width: 1,
            background: "rgba(46,91,186,0.08)",
          }} />
        ))}

        {/* Paths (decorative) */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <path d="M 0 130 Q 120 110 220 150 T 430 130" stroke="rgba(46,91,186,0.15)" strokeWidth="8" fill="none" />
          <path d="M 0 200 L 430 200" stroke="rgba(46,91,186,0.1)" strokeWidth="6" fill="none" />
        </svg>

        <div style={{
          position: "absolute", top: 8, left: 12,
          fontSize: 11, color: COLORS.blueDark, fontWeight: 700, opacity: 0.5,
          letterSpacing: 0.5,
        }}>
          MERCAT CENTRAL
        </div>

        {/* Pins */}
        {filtered.map((shop) => {
          const isSelected = selectedPin === shop.id;
          const userInQueue = shop.queue.some((c) => c.id === DEMO_USER_ID);
          const qLen = shop.queue.length;

          return (
            <div
              key={shop.id}
              onClick={() => handlePinClick(shop.id)}
              style={{
                position: "absolute",
                left: `${shop.position.x}%`,
                top: `${shop.position.y}%`,
                transform: "translate(-50%, -100%)",
                cursor: "pointer",
                zIndex: isSelected ? 10 : 2,
              }}
            >
              {/* Popup */}
              {isSelected && (
                <div style={{
                  position: "absolute",
                  bottom: "100%", left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: 8,
                  background: COLORS.white,
                  borderRadius: 12,
                  padding: "10px 14px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  width: 170,
                  zIndex: 20,
                }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: COLORS.gray900 }}>{shop.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 2 }}>{shop.category}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={s.pill(
                      shop.isOpen ? COLORS.green : COLORS.red,
                      shop.isOpen ? COLORS.greenLight : COLORS.redLight,
                    )}>{shop.isOpen ? "Open" : "Closed"}</span>
                    <span style={{ fontSize: 12, color: COLORS.gray600, fontWeight: 600 }}>
                      {qLen} in queue
                    </span>
                  </div>
                  <button
                    style={{ ...s.btn(true, true), marginTop: 10, width: "100%" }}
                    onClick={(e) => { e.stopPropagation(); onSelectShop(shop.id); }}
                  >
                    View Details →
                  </button>
                </div>
              )}

              {/* Pin */}
              <div style={{
                background: userInQueue ? COLORS.orange : (shop.isOpen ? COLORS.blue : COLORS.gray400),
                borderRadius: "50% 50% 50% 0",
                transform: "rotate(-45deg)",
                width: isSelected ? 40 : 32,
                height: isSelected ? 40 : 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isSelected ? "0 4px 16px rgba(0,0,0,0.25)" : "0 2px 8px rgba(0,0,0,0.15)",
                transition: "all 0.2s",
                border: `3px solid ${COLORS.white}`,
              }}>
                <span style={{ transform: "rotate(45deg)", fontSize: isSelected ? 18 : 14 }}>
                  {getCategoryEmoji(shop.category)}
                </span>
              </div>

              {/* Queue badge */}
              {qLen > 0 && (
                <div style={{
                  position: "absolute", top: -4, right: -4,
                  background: COLORS.orange, color: COLORS.white,
                  borderRadius: "50%", width: 18, height: 18,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 900, border: `2px solid ${COLORS.white}`,
                  transform: "rotate(45deg)",
                }}>
                  {qLen}
                </div>
              )}
            </div>
          );
        })}

        {/* Legend */}
        <div style={{
          position: "absolute", bottom: 8, right: 10,
          background: "rgba(255,255,255,0.9)",
          borderRadius: 8, padding: "6px 10px",
          fontSize: 10, color: COLORS.gray600,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.orange }} />
            <span>You're in queue</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.blue }} />
            <span>Open shop</span>
          </div>
        </div>
      </div>

      {/* Shop List */}
      <div style={{ padding: "0 20px", flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray400, marginBottom: 10 }}>
          {filtered.length} shop{filtered.length !== 1 ? "s" : ""} found
        </div>
        {filtered.map((shop) => {
          const userInQueue = shop.queue.some((c) => c.id === DEMO_USER_ID);
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
                  {getCategoryEmoji(shop.category)}
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

// ─── Customer: Shop Detail ────────────────────────────────────────────────────
function ShopDetail({ shop, onBack, onJoin, onLeave }) {
  const userEntry = getUserQueueEntry(shop);
  const qLen = shop.queue.length;

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueDark} 100%)`,
        padding: "24px 20px 32px",
      }}>
        <button
          onClick={onBack}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "6px 12px", color: COLORS.white, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, marginBottom: 16 }}
        >
          ← Back
        </button>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{getCategoryEmoji(shop.category)}</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.white }}>{shop.name}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
          {shop.category} · {shop.description}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <span style={s.pill(
            shop.isOpen ? COLORS.green : COLORS.red,
            shop.isOpen ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"
          )}>
            {shop.isOpen ? "● Open" : "● Closed"}
          </span>
          <span style={s.pill(COLORS.white, "rgba(255,255,255,0.2)")}>
            ~{shop.avgServiceTime} min/customer
          </span>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* User position */}
        {userEntry && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray600, marginBottom: 8 }}>
              Your Queue Status
            </div>
            <PositionBadge position={userEntry.position} total={qLen} />
          </div>
        )}

        {/* Queue info */}
        <div style={s.card}>
          <div style={{ fontWeight: 800, color: COLORS.gray900, marginBottom: 12 }}>
            Current Queue
          </div>
          {qLen === 0 ? (
            <div style={{ color: COLORS.gray400, fontSize: 14, textAlign: "center", padding: "16px 0" }}>
              No one in queue — join now!
            </div>
          ) : (
            shop.queue.map((c, i) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < qLen - 1 ? `1px solid ${COLORS.gray100}` : "none",
                  background: c.id === DEMO_USER_ID ? COLORS.orangeLight : "transparent",
                  borderRadius: c.id === DEMO_USER_ID ? 8 : 0,
                  paddingLeft: c.id === DEMO_USER_ID ? 8 : 0,
                  paddingRight: c.id === DEMO_USER_ID ? 8 : 0,
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: i === 0 ? COLORS.blue : COLORS.gray100,
                  color: i === 0 ? COLORS.white : COLORS.gray600,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 13, marginRight: 12, flexShrink: 0,
                }}>
                  {c.position}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {c.id === DEMO_USER_ID ? "You 👋" : c.name}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.gray400 }}>
                    ~{getWaitTime(shop, c.position)} min wait
                  </div>
                </div>
                {i === 0 && <span style={s.pill(COLORS.orange, COLORS.orangeLight)}>Next up</span>}
              </div>
            ))
          )}
        </div>

        {/* Action */}
        {shop.isOpen ? (
          userEntry ? (
            <button style={s.btnDanger} onClick={onLeave}>
              Leave Queue
            </button>
          ) : (
            <button style={s.btnOrange()} onClick={onJoin}>
              Join Queue →
            </button>
          )
        ) : (
          <div style={{
            ...s.card, textAlign: "center", color: COLORS.gray400, padding: "16px",
          }}>
            This shop is currently closed
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Owner: Dashboard ─────────────────────────────────────────────────────────
function OwnerDashboard({ shop, onAdvance, onRemove, onToggleOpen }) {
  const qLen = shop.queue.length;
  const totalWait = qLen * shop.avgServiceTime;

  return (
    <div style={{ padding: 20 }}>
      {/* Shop Header */}
      <div style={{ ...s.card, background: COLORS.blue, color: COLORS.white, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{shop.name}</div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>{shop.category}</div>
          </div>
          <div>
            <span style={s.pill(
              shop.isOpen ? COLORS.green : COLORS.red,
              shop.isOpen ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"
            )}>
              {shop.isOpen ? "● Open" : "● Closed"}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {[
            { label: "In queue", value: qLen },
            { label: "Total wait", value: `${totalWait}m` },
            { label: "Avg / customer", value: `${shop.avgServiceTime}m` },
          ].map((stat) => (
            <div key={stat.label} style={{
              flex: 1, background: "rgba(255,255,255,0.12)",
              borderRadius: 12, padding: "12px 10px", textAlign: "center",
            }}>
              <div style={{ fontSize: 22, fontWeight: 900 }}>{stat.value}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle */}
      <button
        style={{
          ...(shop.isOpen ? s.btnDanger : s.btnOrange()),
          width: "100%",
          marginBottom: 20,
          fontSize: 15,
          padding: "13px 20px",
        }}
        onClick={onToggleOpen}
      >
        {shop.isOpen ? "🔒 Close Queue" : "🟢 Open Queue"}
      </button>

      {/* Queue management */}
      <div style={s.sectionTitle}>
        Manage Queue
      </div>

      {qLen === 0 ? (
        <div style={{ ...s.card, textAlign: "center", color: COLORS.gray400, padding: "32px 16px" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
          <div style={{ fontWeight: 700, color: COLORS.gray600 }}>Queue is empty</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>No customers waiting right now.</div>
        </div>
      ) : (
        <>
          {/* Current customer highlight */}
          <div style={{
            ...s.card,
            background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeLight})`,
            border: `2px solid ${COLORS.orange}`,
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.orange, marginBottom: 4 }}>
              NOW SERVING
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.gray900 }}>
              {shop.queue[0].name}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={{ ...s.btnOrange(true), flex: 1, fontSize: 14, padding: "10px" }} onClick={onAdvance}>
                ✓ Done — Next
              </button>
              <button style={s.btnDanger} onClick={() => onRemove(shop.queue[0].id)}>
                Remove
              </button>
            </div>
          </div>

          {/* Rest of queue */}
          {shop.queue.slice(1).map((customer, i) => (
            <div key={customer.id} style={{
              ...s.card,
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: COLORS.gray100, color: COLORS.gray600,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 14, marginRight: 12, flexShrink: 0,
              }}>
                {customer.position}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{customer.name}</div>
                <div style={{ fontSize: 12, color: COLORS.gray400 }}>
                  ~{getWaitTime(shop, customer.position)} min wait
                </div>
              </div>
              <button style={s.btnDanger} onClick={() => onRemove(customer.id)}>
                ✕
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function LineUpApp() {
  const [mode, setMode] = useState(null); // null | "customer" | "owner"
  const [shops, setShops] = useState(INITIAL_SHOPS);
  const [activeTab, setActiveTab] = useState("map");
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  }, []);

  const updateShop = (shopId, updater) => {
    setShops((prev) => prev.map((s) => s.id === shopId ? updater(s) : s));
  };

  // Customer actions
  const joinQueue = (shopId) => {
    const shop = shops.find((s) => s.id === shopId);
    if (!shop || !shop.isOpen) return;
    if (shop.queue.some((c) => c.id === DEMO_USER_ID)) {
      showToast("You're already in this queue!");
      return;
    }
    updateShop(shopId, (s) => ({
      ...s,
      queue: [...s.queue, { id: DEMO_USER_ID, name: DEMO_USER_NAME, position: s.queue.length + 1 }],
    }));
    showToast("✅ You joined the queue!");
    setActiveTab("queues");
  };

  const leaveQueue = (shopId) => {
    updateShop(shopId, (s) => {
      const newQueue = s.queue
        .filter((c) => c.id !== DEMO_USER_ID)
        .map((c, i) => ({ ...c, position: i + 1 }));
      return { ...s, queue: newQueue };
    });
    showToast("You left the queue.");
  };

  // Owner actions
  const ownerShop = shops.find((s) => s.id === OWNER_SHOP_ID);

  const advanceQueue = () => {
    if (!ownerShop || ownerShop.queue.length === 0) return;
    updateShop(OWNER_SHOP_ID, (s) => {
      const newQueue = s.queue.slice(1).map((c, i) => ({ ...c, position: i + 1 }));
      return { ...s, queue: newQueue };
    });
    showToast("✅ Next customer called!");
  };

  const removeFromQueue = (customerId) => {
    updateShop(OWNER_SHOP_ID, (s) => {
      const newQueue = s.queue
        .filter((c) => c.id !== customerId)
        .map((c, i) => ({ ...c, position: i + 1 }));
      return { ...s, queue: newQueue };
    });
    showToast("Customer removed from queue.");
  };

  const toggleShopOpen = () => {
    updateShop(OWNER_SHOP_ID, (s) => ({ ...s, isOpen: !s.isOpen }));
    showToast(ownerShop.isOpen ? "Queue closed." : "Queue opened! Customers can now join.");
  };

  const selectedShop = shops.find((s) => s.id === selectedShopId);

  // ── Render ──
  if (!mode) return <ModeSelector onSelect={setMode} />;

  // Customer tabs
  const customerTabs = [
    { id: "map", label: "Map", icon: "🗺️" },
    { id: "queues", label: "My Queues", icon: "🎫" },
  ];

  const ownerTabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
  ];

  const tabs = mode === "customer" ? customerTabs : ownerTabs;

  const renderContent = () => {
    if (mode === "owner") {
      return (
        <OwnerDashboard
          shop={ownerShop}
          onAdvance={advanceQueue}
          onRemove={removeFromQueue}
          onToggleOpen={toggleShopOpen}
        />
      );
    }

    // Customer
    if (selectedShop) {
      return (
        <ShopDetail
          shop={selectedShop}
          onBack={() => setSelectedShopId(null)}
          onJoin={() => joinQueue(selectedShop.id)}
          onLeave={() => { leaveQueue(selectedShop.id); setSelectedShopId(null); }}
        />
      );
    }

    if (activeTab === "map") {
      return (
        <MapView
          shops={shops}
          onSelectShop={(id) => { setSelectedShopId(id); }}
        />
      );
    }

    if (activeTab === "queues") {
      return (
        <MyQueues
          shops={shops}
          onLeaveQueue={leaveQueue}
          onGoToShop={(id) => { setSelectedShopId(id); setActiveTab("map"); }}
        />
      );
    }
  };

  return (
    <div style={s.app}>
      {/* Header */}
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🛒</span>
          <span style={s.logoText}>Line <span style={s.logoUp}>Up</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={s.pill(COLORS.orange, "rgba(255,255,255,0.15)")}>
            {mode === "owner" ? "Shop Owner" : "Customer"}
          </span>
          <button
            onClick={() => { setMode(null); setSelectedShopId(null); setActiveTab("map"); }}
            style={{
              background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: 8, padding: "5px 10px", color: COLORS.white,
              cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 12,
            }}
          >
            Switch
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={s.content}>
        {renderContent()}
      </div>

      {/* Nav bar */}
      {!selectedShop && (
        <div style={s.navBar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={s.navItem(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ fontSize: 22 }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}