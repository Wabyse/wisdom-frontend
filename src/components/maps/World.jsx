import React, { useMemo } from "react";
import map from "../../assets/world.jpg";

const BASE_W = 666;
const BASE_H = 375;

const H = [
  [-8.42084278, -46.04458495, 1873.53632376],
  [-21.46568457, -24.8419757, 1497.2975029],
  [-0.09047217, -0.05667532, 5.47508561],
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

const STATIC_LOCATIONS = [
  { id: 1, name: " ", lon: 29.5187, lat: 29.4001, color: "#facc15", label: 0.5 },
  { id: 2, name: " ", lon: 29.1187, lat: 29.9001, color: "#22c55e", label: 2 },
  { id: 3, name: " ", lon: 30.1187, lat: 29.8001, color: "#3b82f6", label: -2 },
];
const ID_INDEX = Object.fromEntries(STATIC_LOCATIONS.map((p) => [p.id, p]));

const World = ({ width = BASE_W, height = BASE_H, ids = [] }) => {
  const selected = useMemo(() => {
    const list = Array.isArray(ids) ? ids : [ids];
    return list.map((id) => ID_INDEX[id]).filter(Boolean);
  }, [ids]);

  const placed = useMemo(
    () =>
      selected.map((p) => {
        const [x, y] = project(p.lon, p.lat, width, height);
        return { ...p, x, y };
      }),
    [selected, width, height]
  );

  // label positions
  const boxW = 90;
  const boxH = 28;
  const gap = 12;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        backgroundImage: `url(${map})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        overflow: "hidden",
        borderRadius: 12,
      }}
    >
      {/* Dots */}
      {placed.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.x - 5,
            top: p.y - 5,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: p.color,
            boxShadow: "0 0 0 3px #fff",
          }}
        />
      ))}

      {/* One shared SVG for all lines and arrow markers */}
      {/* <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          pointerEvents: "none",
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="2"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
          </marker>
        </defs>

        {placed.map((p, idx) => {
          const boxX = p.x - boxW / p.label;
          const boxY = height - boxH - 10;

          return (
            <line
              key={p.id}
              x1={p.x}
              y1={p.y}
              x2={boxX + boxW / 2}
              y2={boxY - 150}
              stroke={p.color}
              strokeWidth="2"
              strokeDasharray="4"
              markerEnd="url(#arrowhead)"
              style={{ color: p.color }}
            />
          );
        })}
      </svg> */}

      {/* Bottom label boxes */}
      {/* <div
        style={{
          position: "absolute",
          bottom: 15,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap,
          zIndex: 10,
        }}
      >
        {placed.map((p) => (
          <div
            key={p.id}
            style={{
              background: p.color,
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
              borderRadius: 8,
              padding: "4px 10px",
              minWidth: boxW,
              textAlign: "center",
              boxShadow: "0 2px 6px #0003",
            }}
          >
            {p.name}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default World;