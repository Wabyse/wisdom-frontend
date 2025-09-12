import map from "../assets/map.png";
import React, { useMemo } from "react";

/** Calibrated base size (must keep same aspect ratio when you render) */
const BASE_W = 666;
const BASE_H = 375;

/** Homography H mapping [lon,lat,1]^T -> [x,y,1]^T (for 666×375) */
const H = [
  [-8.42084278, -46.04458495, 1873.53632376],
  [-21.46568457, -24.84197570, 1497.29750290],
  [-0.09047217,  -0.05667532,    5.47508561],
];

function lonLatToPixel(lon, lat) {
  const x = H[0][0] * lon + H[0][1] * lat + H[0][2];
  const y = H[1][0] * lon + H[1][1] * lat + H[1][2];
  const w = H[2][0] * lon + H[2][1] * lat + H[2][2];
  return [x / w, y / w];
}
function project(lon, lat, renderW = BASE_W, renderH = BASE_H) {
  const [x0, y0] = lonLatToPixel(lon, lat);
  return [x0 * (renderW / BASE_W), y0 * (renderH / BASE_H)];
}

/** ---------- Five static locations (edit/extend as you wish) ---------- */
const STATIC_LOCATIONS = [
  { id: 4,  name: "الاسماعيلية",        lon: 33.7187, lat: 30.5001, title: true },
  { id: 5, name: "السويس",             lon: 33.7357, lat: 29.7200, title: true },
  { id: 7, name: "الشرابية",             lon: 31.8000, lat: 30.7000, title: false },
  { id: 9, name: "الشرقية",             lon: 32.9000, lat: 30.7000, title: false },
  { id: 8, name: "بولاق",                   lon: 32.5000, lat: 30.0000, title: true },
  { id: 14, name: "wabys vtc",                   lon: 32.5000, lat: 30.0000, title: true },
];
// id -> location lookup
const ID_INDEX = Object.fromEntries(STATIC_LOCATIONS.map(p => [p.id, p]));

/** Marker (image or dot) */
function Marker({ x, y, title, markerSrc, markerSize = 16, anchor = "center" }) {
  if (markerSrc) {
    const w = markerSize, h = markerSize;
    const style =
      anchor === "bottom"
        ? { left: x - w / 2, top: y - h }
        : { left: x - w / 2, top: y - h / 2 };

    return (
      <img
        src={markerSrc}
        alt={title}
        title={title}
        style={{
          position: "absolute",
          width: w,
          height: h,
          objectFit: "contain",
          pointerEvents: "none",
          ...style,
        }}
      />
    );
  }
  // fallback: dot
  return (
    <div
      title={title}
      style={{
        position: "absolute",
        left: x - 5,
        top: y - 5,
        width: 10,
        height: 10,
        borderRadius: 999,
        background: "#ef4444",
        boxShadow: "0 0 0 2px rgba(255,255,255,0.95)",
        pointerEvents: "none",
      }}
    />
  );
}

/** --------- Map component driven by `ids` from the parent --------- */
const Egypt = ({
  width = BASE_W,
  height = BASE_H,
  ids = [],                 // string | string[]  (e.g., "cairo" or ["alex","cairo"])
  showLabels = true,
  markerSrc,                // e.g., import pin from "../assets/pin.png"
  markerSize = 16,
  markerAnchor = "center",  // or "bottom" if your pin tip should touch the point
}) => {
  // Normalize ids -> selected fixed locations
  const selected = useMemo(() => {
    const list = Array.isArray(ids) ? ids : (ids ? [ids] : []);
    return list
      .map(id => {
        const p = ID_INDEX[id];
        if (!p) {
          console.warn(`[Egypt] Unknown id: "${id}"`);
          return null;
        }
        return p;
      })
      .filter(Boolean);
  }, [ids]);

  // Project to pixels for the current render size
  const placed = useMemo(() => {
    return selected.map(p => {
      const [x, y] = project(p.lon, p.lat, width, height);
      return { ...p, x, y };
    });
  }, [selected, width, height]);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundImage: `url(${map})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {placed.map(p => (
        <React.Fragment key={p.id}>
          <Marker
            x={p.x}
            y={p.y}
            title={p.name}
            markerSrc={markerSrc}
            markerSize={markerSize}
            anchor={markerAnchor}
          />
          {showLabels && (
            <div
              style={{
                position: "absolute",
                left: p.title ? p.id === 4 ? p.x + 25 : p.x + 8 : p.x - 60,
                top: p.y - 6,
                padding: "2px 6px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.5)",
                color: "white",
                fontSize: 12,
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {p.name}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Egypt;