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

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = {
  app: {
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    background: COLORS.gray50,
    minHeight: "100vh",
    maxWidth: 430,
    margin: "0 auto",
    position: "relative",
    boxShadow: "0 0 50px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    background: COLORS.blue,
    padding: "16px 20px",
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
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderTop: `1px solid ${COLORS.gray200}`,
    display: "flex",
    zIndex: 100,
  },
  navItem: (active) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px 4px 10px",
    cursor: "pointer",
    color: active ? COLORS.blue : COLORS.gray400,
    fontWeight: active ? 700 : 500,
    fontSize: 11,
    gap: 4,
    transition: "all 0.2s",
    background: "none",
    border: "none",
  }),
  card: {
    background: COLORS.white,
    borderRadius: 24,
    padding: "20px",
    marginBottom: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    border: `1px solid ${COLORS.gray100}`,
  },
  pill: (color, bg) => ({
    display: "inline-block",
    background: bg,
    color: color,
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 12,
    fontWeight: 700,
  }),
  btn: (primary = true, small = false) => ({
    background: primary ? COLORS.blue : COLORS.white,
    color: primary ? COLORS.white : COLORS.blue,
    border: primary ? "none" : `2px solid ${COLORS.blue}`,
    borderRadius: 16,
    padding: small ? "10px 18px" : "16px 24px",
    fontWeight: 700,
    fontSize: small ? 14 : 16,
    cursor: "pointer",
    width: primary && !small ? "100%" : "auto",
    fontFamily: "inherit",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "scale(1)",
  }),
  btnOrange: (small = false) => ({
    background: COLORS.orange,
    color: COLORS.white,
    border: "none",
    borderRadius: 16,
    padding: small ? "10px 18px" : "16px 24px",
    fontWeight: 700,
    fontSize: small ? 14 : 16,
    cursor: "pointer",
    width: small ? "auto" : "100%",
    fontFamily: "inherit",
    transition: "all 0.2s",
  }),
  btnDanger: {
    background: COLORS.redLight,
    color: COLORS.red,
    border: "none",
    borderRadius: 16,
    padding: "12px 20px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  input: {
    width: "100%",
    padding: "16px 20px",
    borderRadius: 18,
    border: `2px solid ${COLORS.gray200}`,
    fontSize: 16,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    color: COLORS.gray900,
    transition: "all 0.2s",
    background: COLORS.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: COLORS.gray900,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  toast: (show) => ({
    position: "fixed",
    bottom: 100,
    left: "50%",
    transform: `translateX(-50%) translateY(${show ? 0 : 30}px)`,
    opacity: show ? 1 : 0,
    background: COLORS.gray900,
    color: COLORS.white,
    padding: "16px 32px",
    borderRadius: 40,
    fontWeight: 700,
    fontSize: 14,
    zIndex: 999,
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    pointerEvents: "none",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  }),
};

// ─── Components ──────────────────────────────────────────────────────────────
function Toast({ message, show }) {
  return <div style={s.toast(show)}>{message}</div>;
}

function PositionBadge({ position, total, avgServiceTime }) {
  return (
    <div style={{
      background: COLORS.blueLight, borderRadius: 24, padding: "24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      border: `2px solid ${COLORS.blue}10`,
    }}>
      <div>
        <div style={{ fontSize: 14, color: COLORS.gray600, fontWeight: 600 }}>Your position</div>
        <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.blue, lineHeight: 1, marginTop: 4 }}>
          #{position}
        </div>
        <div style={{ fontSize: 13, color: COLORS.gray400, marginTop: 6 }}>of {total} in queue</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 14, color: COLORS.gray600, fontWeight: 600 }}>Est. wait</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.orange, lineHeight: 1, marginTop: 4 }}>
          {getWaitTime({ avgServiceTime }, position)}m
        </div>
        <div style={{ fontSize: 13, color: COLORS.gray400, marginTop: 6 }}>minutes</div>
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
      border: userInQueue ? `2px solid ${COLORS.orange}` : "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: 32 }}>{getCategoryEmoji(shop.category)}</div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ background: "#F0F2F5", border: "none", borderRadius: "50%", width: 32, height: 32, color: COLORS.gray400, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      </div>
      <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.gray900 }}>{shop.name}</div>
      <div style={{ fontSize: 14, color: COLORS.gray400, marginTop: 2 }}>{shop.category}</div>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, alignItems: "center" }}>
        <span style={s.pill(
          shop.isOpen ? COLORS.green : COLORS.red,
          shop.isOpen ? COLORS.greenLight : COLORS.redLight,
        )}>{shop.isOpen ? "Open" : "Closed"}</span>
        <span style={{ fontSize: 14, color: COLORS.gray600, fontWeight: 700 }}>
          {qLen} waiting
        </span>
      </div>

      <button
        style={{ ...s.btn(true, true), marginTop: 18, width: "100%", borderRadius: 14 }}
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
      background: `linear-gradient(135deg, #e8f0fe 0%, #dbeafe 50%, #eff6ff 100%)`,
      borderRadius: 28, position: "relative", height: 340, overflow: "hidden",
      border: `2px solid ${COLORS.gray200}`, flexShrink: 0,
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
              background: userInQueue ? COLORS.orange : (shop.isOpen ? COLORS.blue : COLORS.gray400),
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
                position: "absolute", top: -6, right: -6, background: COLORS.orange, color: COLORS.white,
                borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, border: `2.5px solid ${COLORS.white}`, transform: "rotate(45deg)",
              }}>
                {qLen}
              </div>
            )}
          </div>
        );
      })}
      
      <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(255,255,255,0.98)", borderRadius: 14, padding: "10px 16px", fontSize: 11, color: COLORS.gray600, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: `1px solid ${COLORS.gray100}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.orange }} />
          <span style={{ fontWeight: 700 }}>Your active queues</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.blue }} />
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
        <div style={{ ...s.card, textAlign: "center", padding: "80px 24px", color: COLORS.gray400 }}>
          <div style={{ fontSize: 80, marginBottom: 24, opacity: 0.5 }}>🎫</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: COLORS.gray600 }}>No active queues</div>
          <div style={{ fontSize: 15, marginTop: 10, maxWidth: 240, margin: "10px auto 0" }}>Browse the market map to find shops and join a queue.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={s.sectionTitle}>Active Tickets</div>
      {myQueues.map(({ shop, entry }) => (
        <div key={shop.id} style={{ ...s.card, border: `2.5px solid ${COLORS.blue}10` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.gray900 }}>
                {getCategoryEmoji(shop.category)} {shop.name}
              </div>
              <div style={{ fontSize: 14, color: COLORS.gray400, marginTop: 4 }}>{shop.category}</div>
            </div>
            <span style={s.pill(COLORS.green, COLORS.greenLight)}>Active Now</span>
          </div>
          <PositionBadge position={entry.position} total={shop.queue.length} avgServiceTime={shop.avgServiceTime} />
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button style={{ ...s.btn(true, true), flex: 1.5 }} onClick={() => onGoToShop(shop.id)}>Go to Shop</button>
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
        <button onClick={() => setShowFilters(!showFilters)} style={{ ...s.btn(false, true), padding: "0 18px", borderRadius: 18, background: showFilters ? COLORS.blueLight : COLORS.white, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚙️</span><span style={{ fontSize: 15, fontWeight: 700 }}>Filter</span>
        </button>
      </div>

      {showFilters && (
        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ ...s.pill(category === cat ? COLORS.white : COLORS.gray600, category === cat ? COLORS.blue : COLORS.gray100), cursor: "pointer", border: "none", whiteSpace: "nowrap", padding: "12px 20px", fontWeight: 700, transition: "all 0.2s" }}>
              {cat}
            </button>
          ))}
        </div>
      )}

      <MarketMap shops={filtered} onSelectShop={onSelectShop} />

      <div style={{ padding: "0 20px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray400, letterSpacing: 0.5 }}>{filtered.length} SHOPS AVAILABLE</div>
        </div>
        {filtered.map((shop) => {
          const userInQueue = shop.queue.some((c) => c.id === DEMO_USER_ID);
          return (
            <div key={shop.id} style={{ ...s.card, cursor: "pointer", transform: "translateZ(0)", border: userInQueue ? `2.5px solid ${COLORS.orange}` : `1px solid ${COLORS.gray100}` }} onClick={() => onSelectShop(shop.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 18, background: COLORS.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
                  {getCategoryEmoji(shop.category)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.gray900 }}>{shop.name}</div>
                  <div style={{ fontSize: 14, color: COLORS.gray400 }}>{shop.category}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={s.pill(shop.isOpen ? COLORS.green : COLORS.red, shop.isOpen ? COLORS.greenLight : COLORS.redLight)}>{shop.isOpen ? "Open" : "Closed"}</span>
                  {shop.queue.length > 0 && <div style={{ fontSize: 13, color: COLORS.gray400, marginTop: 6, fontWeight: 600 }}>{shop.queue.length} in line</div>}
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
      <div style={{ background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueDark} 100%)`, padding: "28px 24px 44px", borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 14, padding: "10px 18px", color: COLORS.white, cursor: "pointer", fontWeight: 700, marginBottom: 24 }}>← Back</button>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{getCategoryEmoji(shop.category)}</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.white }}>{shop.name}</div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", marginTop: 8, lineHeight: 1.5 }}>{shop.description}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <span style={s.pill(shop.isOpen ? COLORS.green : COLORS.red, shop.isOpen ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)")}>{shop.isOpen ? "● Open Now" : "● Closed"}</span>
          <span style={s.pill(COLORS.white, "rgba(255,255,255,0.25)")}>~{shop.avgServiceTime} min/person</span>
        </div>
      </div>

      <div style={{ padding: 24, marginTop: -20 }}>
        {userEntry && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray600, marginBottom: 12 }}>Your Place in Line</div>
            <PositionBadge position={userEntry.position} total={qLen} avgServiceTime={shop.avgServiceTime} />
          </div>
        )}

        <div style={s.card}>
          <div style={{ fontWeight: 800, color: COLORS.gray900, marginBottom: 20, fontSize: 17 }}>Queue Timeline</div>
          {qLen === 0 ? (
            <div style={{ color: COLORS.gray400, fontSize: 15, textAlign: "center", padding: "32px 0" }}>Queue is empty. Join first!</div>
          ) : (
            shop.queue.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: i < qLen - 1 ? `1px solid ${COLORS.gray100}` : "none", background: c.id === DEMO_USER_ID ? COLORS.orangeLight : "transparent", borderRadius: 12, paddingLeft: c.id === DEMO_USER_ID ? 12 : 0, paddingRight: c.id === DEMO_USER_ID ? 12 : 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: i === 0 ? COLORS.blue : COLORS.gray100, color: i === 0 ? COLORS.white : COLORS.gray600, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, marginRight: 16 }}>{c.position}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{c.id === DEMO_USER_ID ? "You 👋" : c.name}</div>
                  <div style={{ fontSize: 13, color: COLORS.gray400 }}>~{getWaitTime(shop, c.position)} min wait</div>
                </div>
                {i === 0 && <span style={s.pill(COLORS.orange, COLORS.orangeLight)}>Up Next</span>}
              </div>
            ))
          )}
        </div>

        {shop.isOpen ? (
          userEntry ? (
            <button style={{ ...s.btnDanger, width: "100%", marginTop: 12, borderRadius: 18, padding: "16px" }} onClick={onLeave}>Leave Queue</button>
          ) : (
            <button style={s.btnOrange()} onClick={onJoin}>Join Queue Now →</button>
          )
        ) : (
          <div style={{ ...s.card, textAlign: "center", color: COLORS.gray400, background: COLORS.gray50, border: `1px dashed ${COLORS.gray200}`, padding: "32px 20px" }}>
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
      <div style={{ ...s.card, background: COLORS.blue, color: COLORS.white, marginBottom: 24, padding: "32px 24px", borderRadius: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>{shop.name}</div>
            <div style={{ fontSize: 16, opacity: 0.85, marginTop: 4 }}>Control Center</div>
          </div>
          <span style={s.pill(shop.isOpen ? COLORS.green : COLORS.red, shop.isOpen ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)")}>
            {shop.isOpen ? "● Active" : "● Offline"}
          </span>
        </div>
      </div>

      <button style={{ ...(shop.isOpen ? s.btnDanger : s.btnOrange()), width: "100%", marginBottom: 32, fontSize: 17, padding: "20px", borderRadius: 20 }} onClick={onToggleOpen}>
        {shop.isOpen ? "🔒 Close Queue for Now" : "🟢 Open Queue to Public"}
      </button>

      <div style={s.sectionTitle}>Manage Queue ({qLen})</div>

      {qLen === 0 ? (
        <div style={{ ...s.card, textAlign: "center", color: COLORS.gray400, padding: "64px 24px" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
          <div style={{ fontWeight: 900, color: COLORS.gray600, fontSize: 18 }}>Queue is Cleared</div>
          <div style={{ fontSize: 15, marginTop: 10 }}>Ready for the next rush.</div>
        </div>
      ) : (
        <>
          <div style={{ ...s.card, background: `linear-gradient(135deg, ${COLORS.orangeLight}, #fff)`, border: `2.5px solid ${COLORS.orange}`, marginBottom: 20, padding: 24, borderRadius: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.orange, marginBottom: 10, letterSpacing: 1.5 }}>SERVE NOW</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.gray900 }}>{shop.queue[0].name}</div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button style={{ ...s.btnOrange(true), flex: 2, borderRadius: 16 }} onClick={onAdvance}>✓ Call Next</button>
              <button style={{ ...s.btnDanger, flex: 1, borderRadius: 16 }} onClick={() => onRemove(shop.queue[0].id)}>Remove</button>
            </div>
          </div>

          {shop.queue.slice(1).map((customer) => (
            <div key={customer.id} style={{ ...s.card, display: "flex", alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: COLORS.gray100, color: COLORS.gray600, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, marginRight: 20 }}>{customer.position}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{customer.name}</div>
                <div style={{ fontSize: 13, color: COLORS.gray400 }}>Waiting in line</div>
              </div>
              <button style={{ background: "#FEE2E2", border: "none", color: COLORS.red, cursor: "pointer", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => onRemove(customer.id)}>✕</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function ModeSelector({ onSelect }) {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.blue, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ marginBottom: 80, textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🛒</div>
        <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, letterSpacing: "-2px" }}>Line <span style={{ color: COLORS.orange }}>Up</span></div>
        <div style={{ color: "rgba(255,255,255,0.75)", marginTop: 16, fontSize: 20, fontWeight: 600 }}>Market Queueing Reimagined</div>
      </div>

      <div style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 800, letterSpacing: 2, textAlign: "center", marginBottom: 24, textTransform: "uppercase" }}>Select Experience</div>
        <button style={{ width: "100%", background: COLORS.white, border: "none", borderRadius: 32, padding: "28px", cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 24, textAlign: "left", fontFamily: "inherit", boxShadow: "0 15px 35px rgba(0,0,0,0.25)" }} onClick={() => onSelect("customer")}>
          <div style={{ fontSize: 48 }}>🧺</div>
          <div><div style={{ fontSize: 20, fontWeight: 900, color: COLORS.gray900 }}>Customer</div><div style={{ fontSize: 14, color: COLORS.gray600, marginTop: 4 }}>Find shops & join line</div></div>
        </button>
        <button style={{ width: "100%", background: COLORS.orange, border: "none", borderRadius: 32, padding: "28px", cursor: "pointer", display: "flex", alignItems: "center", gap: 24, textAlign: "left", fontFamily: "inherit", boxShadow: "0 15px 35px rgba(0,0,0,0.25)" }} onClick={() => onSelect("owner")}>
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
  const [mode, setMode] = useState(null); 
  const [shops, setShops] = useState(INITIAL_SHOPS);
  const [activeTab, setActiveTab] = useState("map");
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  }, []);

  const updateShop = (shopId, updater) => {
    setShops((prev) => prev.map((s) => s.id === shopId ? updater(s) : s));
  };

  const joinQueue = (shopId) => {
    const shop = shops.find((s) => s.id === shopId);
    if (!shop || !shop.isOpen) return;
    if (shop.queue.some((c) => c.id === DEMO_USER_ID)) {
      showToast("Already in queue!"); return;
    }
    updateShop(shopId, (s) => ({
      ...s, queue: [...s.queue, { id: DEMO_USER_ID, name: DEMO_USER_NAME, position: s.queue.length + 1 }],
    }));
    showToast("✅ Successfully joined!"); setActiveTab("queues");
  };

  const cancelQueue = (shopId, userId) => {
    updateShop(shopId, (s) => ({
      ...s, queue: s.queue.filter((c) => c.id !== userId).map((c, i) => ({ ...c, position: i + 1 })),
    }));
    showToast(userId === DEMO_USER_ID ? "Left queue." : "Customer removed.");
  };

  const ownerShop = shops.find((s) => s.id === OWNER_SHOP_ID);
  const selectedShop = shops.find((s) => s.id === selectedShopId);

  const toggleQueueStatus = () => {
    updateShop(OWNER_SHOP_ID, (s) => ({ ...s, isOpen: !s.isOpen }));
    showToast(ownerShop.isOpen ? "Queue Closed." : "Queue is now Open!");
  };

  const advanceQueue = () => {
    if (!ownerShop || ownerShop.queue.length === 0) return;
    cancelQueue(OWNER_SHOP_ID, ownerShop.queue[0].id);
    showToast("✅ Next customer called!");
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
          <span style={s.logoText}>Line <span style={s.logoUp}>Up</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={s.pill(COLORS.orange, "rgba(255,255,255,0.2)")}>{mode === "owner" ? "Owner" : "Guest"}</span>
          <button onClick={() => { setMode(null); setSelectedShopId(null); setActiveTab("map"); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 14px", color: COLORS.white, cursor: "pointer", fontWeight: 800, fontSize: 13, transition: "all 0.2s" }}>Switch</button>
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
      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}
