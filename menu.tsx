import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "yums_menu_v3";

const defaultData = {
  categories: [
    {
      id: "drinks", name: "Drinks",
      items: [
        { id: "d1", name: "Lemonade", desc: "classic fresh lemonade · 16oz", price: "$3", available: true },
        { id: "d2", name: "Mango Agua Fresca", desc: "fresh mango agua fresca · 16oz", price: "$4", available: true },
        { id: "d3", name: "Passion Fruit Juice", desc: "fresh passion fruit juice · 16oz", price: "$4", available: true },
        { id: "d4", name: "Piña Colada Agua Fresca", desc: "pineapple · coconut · evaporated & condensed milk · 16oz", price: "$6", available: true },
      ],
    },
    {
      id: "desserts", name: "Desserts",
      items: [
        { id: "ds1", name: "Brownie", desc: "fudgy chocolate brownie · sold by the square", price: "$2", available: true },
        { id: "ds2", name: "Brookie", desc: "fudgy brownie + choc chip cookie dough baked together · by the square", price: "$3", available: true },
        { id: "ds3", name: "Tres Leches", desc: "soaked sponge cake · three milks · any topping included · 7oz", price: "$6", priceSub: "2 for $11", available: true },
        { id: "ds4", name: "Brownie Tres Leches", desc: "fudgy brownie base soaked in three milks · whipped topping · any topping · 7oz", price: "$6", priceSub: "2 for $11", available: true },
        { id: "ds5", name: "Banana Pudding", desc: "layered nilla · creamy pudding · fresh banana · whipped cream · 8oz", price: "$7", available: true },
      ],
    },
    {
      id: "hot", name: "Hot Food",
      items: [
        { id: "h1", name: "Yaroa", desc: "seasoned fries · seasoned ground beef · melted mozzarella · signature 4-sauce drizzle", price: "$13", available: true },
        { id: "h2", name: "Empanadas (hot)", desc: "beef · chicken · ham · cheese · DM for more fillings", price: "2 → $5\n3 → $8\n4 → $10\n6 → $15\n12 → $30\n20 → $50", multiPrice: true, available: true },
      ],
    },
    {
      id: "frozen", name: "Empanadas (Frozen / Uncooked)",
      items: [
        { id: "f1", name: "Empanada Batch", desc: "frozen uncooked · beef · chicken · ham · cheese · ready to fry at home · DM for more fillings", price: "2 → $5\n3 → $8\n4 → $10\n6 → $15\n12 → $30\n20 → $50", multiPrice: true, available: true },
      ],
    },
  ],
};

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function YumsMenu() {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [saved, setSaved] = useState(false);
  const pinRef = useRef(null);
  const ADMIN_PIN = "1234";

  useEffect(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); setData(s ? JSON.parse(s) : defaultData); }
    catch { setData(defaultData); }
  }, []);

  const persist = (d) => { setData(d); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} };
  const tryEdit = () => { setShowPin(true); setPinError(false); setPin(""); setTimeout(() => pinRef.current?.focus(), 80); };
  const submitPin = () => { if (pin === ADMIN_PIN) { setEditMode(true); setShowPin(false); } else setPinError(true); };
  const updateItem = (cid, iid, f, v) => persist({ ...data, categories: data.categories.map(c => c.id !== cid ? c : { ...c, items: c.items.map(i => i.id !== iid ? i : { ...i, [f]: v }) }) });
  const removeItem = (cid, iid) => persist({ ...data, categories: data.categories.map(c => c.id !== cid ? c : { ...c, items: c.items.filter(i => i.id !== iid) }) });
  const addItem = (cid) => persist({ ...data, categories: data.categories.map(c => c.id !== cid ? c : { ...c, items: [...c.items, { id: uid(), name: "New Item", desc: "", price: "$0", available: true }] }) });
  const updateCatName = (cid, v) => persist({ ...data, categories: data.categories.map(c => c.id !== cid ? c : { ...c, name: v }) });
  const removeCat = (cid) => persist({ ...data, categories: data.categories.filter(c => c.id !== cid) });
  const addCat = () => persist({ ...data, categories: [...data.categories, { id: uid(), name: "New Category", items: [] }] });

  if (!data) return null;

  const gold = "#c9a84c";
  const goldDim = "#b8952a";
  const bg = "#100e08";
  const card = "#181209";
  const serif = "'Playfair Display', 'Georgia', serif";
  const body = "'Lora', 'Georgia', serif";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: "#e8d5a3", fontFamily: body, paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Lora:ital,wght@0,400;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { outline: none; }
        ::placeholder { color: #b8952a40; }
        .card { transition: background 0.18s; }
        .card:hover { background: #1e1710 !important; }
      `}</style>

      {/* PIN modal */}
      {showPin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#161108", border: `1px solid ${goldDim}30`, borderRadius: 28, padding: "40px 28px", width: "100%", maxWidth: 320 }}>
            <p style={{ fontFamily: serif, fontSize: 22, color: gold, textAlign: "center", marginBottom: 24 }}>Admin Access</p>
            <input ref={pinRef} type="password" value={pin} maxLength={8}
              onChange={e => { setPin(e.target.value); setPinError(false); }}
              onKeyDown={e => e.key === "Enter" && submitPin()}
              placeholder="· · · ·"
              style={{ width: "100%", padding: "14px", background: "#0d0b06", border: pinError ? "1.5px solid #c0504040" : `1.5px solid ${goldDim}25`, borderRadius: 14, color: "#e8d5a3", fontSize: 24, letterSpacing: 10, fontFamily: serif, textAlign: "center" }} />
            {pinError && <p style={{ color: "#c07070", fontSize: 12, textAlign: "center", marginTop: 8, fontStyle: "italic" }}>wrong pin, try again</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={() => setShowPin(false)} style={{ flex: 1, padding: 13, borderRadius: 14, border: `1px solid ${goldDim}25`, background: "transparent", color: `${gold}80`, cursor: "pointer", fontFamily: body, fontSize: 14 }}>cancel</button>
              <button onClick={submitPin} style={{ flex: 1, padding: 13, borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${gold}, #8a6418)`, color: "#0d0b06", cursor: "pointer", fontFamily: serif, fontSize: 14, fontWeight: 700 }}>enter</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 20px", gap: 8, borderBottom: editMode ? `1px solid ${goldDim}12` : "none" }}>
        {editMode ? (
          <>
            <span style={{ marginRight: "auto", fontSize: 11, color: `${goldDim}50`, fontStyle: "italic", alignSelf: "center" }}>editing</span>
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
              style={{ padding: "7px 20px", borderRadius: 20, border: "none", background: saved ? "#2a5040" : `linear-gradient(135deg, ${gold}, #8a6418)`, color: saved ? "#90c8a8" : "#0d0b06", cursor: "pointer", fontFamily: serif, fontSize: 13, fontWeight: 700, transition: "all 0.3s" }}>
              {saved ? "✓ saved" : "save"}
            </button>
            <button onClick={() => setEditMode(false)} style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${goldDim}25`, background: "transparent", color: `${gold}60`, cursor: "pointer", fontFamily: body, fontSize: 13 }}>done</button>
          </>
        ) : (
          <button onClick={tryEdit} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${goldDim}25`, background: "transparent", color: `${gold}50`, cursor: "pointer", fontFamily: body, fontSize: 12 }}>⚙ edit</button>
        )}
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "48px 24px 40px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.38em", color: `${goldDim}70`, fontStyle: "italic", marginBottom: 20, fontFamily: body }}>handmade with love</p>
        <h1 style={{ fontFamily: serif, fontSize: 76, fontWeight: 900, color: gold, lineHeight: 1, letterSpacing: -1, textShadow: `0 0 60px ${goldDim}25` }}>Yums</h1>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: 28, color: "#9a7535", marginTop: 4, marginBottom: 32 }}>by Yari</p>
        <div style={{ width: 120, height: 1, background: `linear-gradient(to right, transparent, ${goldDim}50, transparent)`, margin: "0 auto" }} />
      </div>

      {/* Menu body */}
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 16px" }}>
        {data.categories.map((cat) => (
          <div key={cat.id} style={{ marginBottom: 40 }}>

            {/* Category heading */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: `${goldDim}40` }} />
              {editMode
                ? <input value={cat.name} onChange={e => updateCatName(cat.id, e.target.value)}
                    style={{ background: "transparent", border: `1px dashed ${goldDim}35`, borderRadius: 8, color: gold, fontFamily: serif, fontStyle: "italic", fontSize: 15, padding: "3px 10px", minWidth: 140 }} />
                : <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 15, color: gold, whiteSpace: "nowrap" }}>{cat.name}</span>
              }
              <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${goldDim}40, transparent)` }} />
              {editMode && (
                <button onClick={() => removeCat(cat.id)} style={{ background: "none", border: `1px solid #c0504030`, borderRadius: 8, color: "#c07070", cursor: "pointer", padding: "2px 8px", fontSize: 11 }}>remove</button>
              )}
            </div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {cat.items.map((item) => (
                <div key={item.id} className="card" style={{ background: card, borderRadius: 16, padding: "16px 20px", border: `1px solid ${goldDim}12`, opacity: item.available ? 1 : 0.42, display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    {editMode ? (
                      <>
                        <input value={item.name} onChange={e => updateItem(cat.id, item.id, "name", e.target.value)}
                          style={{ width: "100%", background: "transparent", border: `1px dashed ${goldDim}35`, borderRadius: 8, color: "#e8d5a3", fontFamily: serif, fontSize: 17, padding: "3px 8px", marginBottom: 6 }} />
                        <input value={item.desc || ""} onChange={e => updateItem(cat.id, item.id, "desc", e.target.value)}
                          placeholder="description"
                          style={{ width: "100%", background: "transparent", border: `1px dashed ${goldDim}20`, borderRadius: 8, color: "#7a6a4a", fontFamily: body, fontStyle: "italic", fontSize: 13, padding: "3px 8px" }} />
                      </>
                    ) : (
                      <>
                        <p style={{ fontFamily: serif, fontSize: 18, color: "#e2cfa0", marginBottom: 4 }}>
                          {item.name}
                          {!item.available && (
                            <span style={{ fontSize: 9, letterSpacing: "0.1em", color: "#c07070", border: "1px solid #c0504030", borderRadius: 6, padding: "1px 7px", marginLeft: 10, verticalAlign: "middle" }}>SOLD OUT</span>
                          )}
                        </p>
                        {item.desc && <p style={{ fontFamily: body, fontStyle: "italic", fontSize: 13, color: "#6a5c3c", lineHeight: 1.6 }}>{item.desc}</p>}
                      </>
                    )}
                  </div>

                  {/* Price */}
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    {editMode ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
                        <input value={item.price} onChange={e => updateItem(cat.id, item.id, "price", e.target.value)}
                          style={{ width: 110, background: "transparent", border: `1px dashed ${goldDim}35`, borderRadius: 8, color: gold, fontFamily: serif, fontSize: 15, padding: "3px 8px", textAlign: "right" }} />
                        {item.priceSub !== undefined && (
                          <input value={item.priceSub || ""} onChange={e => updateItem(cat.id, item.id, "priceSub", e.target.value)}
                            placeholder="e.g. 2 for $11"
                            style={{ width: 110, background: "transparent", border: `1px dashed ${goldDim}18`, borderRadius: 8, color: "#9a7535", fontFamily: body, fontSize: 11, padding: "2px 8px", textAlign: "right" }} />
                        )}
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          <button onClick={() => updateItem(cat.id, item.id, "available", !item.available)}
                            style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, border: `1px solid ${goldDim}25`, background: "none", color: `${goldDim}70`, cursor: "pointer" }}>
                            {item.available ? "mark sold out" : "mark available"}
                          </button>
                          <button onClick={() => removeItem(cat.id, item.id)}
                            style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, border: "1px solid #c0504028", background: "none", color: "#c07070", cursor: "pointer" }}>remove</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {item.multiPrice
                          ? <p style={{ fontFamily: body, fontSize: 13, color: gold, whiteSpace: "pre", lineHeight: 2, textAlign: "right" }}>{item.price}</p>
                          : <p style={{ fontFamily: serif, fontSize: 22, color: gold }}>{item.price}</p>
                        }
                        {item.priceSub && <p style={{ fontSize: 11, color: "#7a5f28", fontStyle: "italic", marginTop: 2 }}>{item.priceSub}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {editMode && (
              <button onClick={() => addItem(cat.id)} style={{ marginTop: 8, width: "100%", padding: 11, borderRadius: 14, border: `1.5px dashed ${goldDim}20`, background: "transparent", color: `${goldDim}45`, cursor: "pointer", fontFamily: body, fontStyle: "italic", fontSize: 13 }}>
                + add item
              </button>
            )}
          </div>
        ))}

        {editMode && (
          <button onClick={addCat} style={{ width: "100%", padding: 14, borderRadius: 16, border: `1.5px dashed ${goldDim}22`, background: "transparent", color: `${goldDim}50`, cursor: "pointer", fontFamily: body, fontStyle: "italic", fontSize: 14, marginBottom: 24 }}>
            + add category
          </button>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: 40 }}>
          <div style={{ width: 100, height: 1, background: `linear-gradient(to right, transparent, ${goldDim}40, transparent)`, margin: "0 auto 16px" }} />
          <p style={{ fontFamily: body, fontStyle: "italic", fontSize: 12, color: `${goldDim}35`, letterSpacing: "0.15em" }}>made fresh · made with love</p>
        </div>
      </div>
    </div>
  );
}
