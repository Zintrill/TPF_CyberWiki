import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { termNodes } from "../data/articles";
import "./ToolsPage.css";

const allNodes = [
  { id: "mitigation", label: "Mitigation", x: 50, y: 50, status: "ACTIVE" },
  { id: "traffic-scrubbing", label: "Traffic Scrubbing", x: 18, y: 33 },
  { id: "rate-limiting", label: "Rate Limiting", x: 25, y: 68 },
  { id: "ddos-defense", label: "DDoS Defense", x: 58, y: 63 },
  { id: "anycast", label: "Anycast Network", x: 57, y: 24 },
];

const definitions = {
  mitigation: {
    tags: ["DEFENSE-TECH", "ACTIVE"],
    title: "Mitigation",
    body: "The systematic process of reducing or eliminating the impact of cyber threats through proactive infrastructure design and reactive response protocols. In the context of cybersecurity, mitigation strategies aim to neutralize attacks like DDoS before they can saturate bandwidth or exploit server resources.",
    keyConcepts: [
      { name: "Redundancy", desc: "Ensuring failover systems are in place." },
      { name: "Heuristic Analysis", desc: "Detecting anomalies through behavioral patterns." },
    ],
    related: ["Understanding DDoS", "Rate Limiting Best Practices"],
  },
  "traffic-scrubbing": {
    tags: ["DEFENSE-TECH"],
    title: "Traffic Scrubbing",
    body: "A process that inspects incoming network traffic to detect and remove malicious packets before they reach the target server, using deep packet inspection and behavioral analysis.",
    keyConcepts: [
      { name: "Deep Packet Inspection", desc: "Analyzing full packet content, not just headers." },
      { name: "Scrubbing Centers", desc: "Dedicated facilities for large-scale traffic filtering." },
    ],
    related: ["Mitigation", "DDoS Defense"],
  },
  "rate-limiting": {
    tags: ["DEFENSE-TECH"],
    title: "Rate Limiting",
    body: "A technique used to control the rate of requests a client can make to a server within a given time window, preventing abuse and reducing the impact of DDoS attacks.",
    keyConcepts: [
      { name: "Token Bucket", desc: "Algorithm for smoothing bursts of traffic." },
      { name: "Sliding Window", desc: "Flexible rate window for request counting." },
    ],
    related: ["Mitigation", "Traffic Scrubbing"],
  },
  "ddos-defense": {
    tags: ["DEFENSE-TECH"],
    title: "DDoS Defense",
    body: "A collection of strategies and technologies designed to detect, absorb, and mitigate Distributed Denial of Service attacks, protecting service availability.",
    keyConcepts: [
      { name: "Anycast Routing", desc: "Distributing attack traffic across multiple PoPs." },
      { name: "BGP Blackholing", desc: "Routing malicious traffic to null routes." },
    ],
    related: ["Mitigation", "Traffic Scrubbing"],
  },
  anycast: {
    tags: ["NETWORK"],
    title: "Anycast Network",
    body: "A network addressing and routing methodology in which a single IP address is shared by multiple servers. Requests are routed to the nearest server, improving performance and resilience.",
    keyConcepts: [
      { name: "PoP", desc: "Point of Presence — local edge servers." },
      { name: "BGP Routing", desc: "Protocol used to implement anycast routing." },
    ],
    related: ["DDoS Defense", "Mitigation"],
  },
};

export default function ToolsPage() {
  const [selected, setSelected] = useState("mitigation");
  const def = definitions[selected];

  return (
    <div className="page-wrapper">
      <title>Interactive Terminology Map Page</title>
      <Navbar />
      <main className="tools-main">
        <div className="graph-container">
          <svg className="graph-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {allNodes.slice(1).map((node) => (
              <line
                key={node.id}
                x1={allNodes[0].x}
                y1={allNodes[0].y}
                x2={node.x}
                y2={node.y}
                stroke="rgba(0,200,255,0.25)"
                strokeWidth="0.3"
              />
            ))}
            {allNodes.map((node) => {
              const isCenter = node.id === "mitigation";
              const isSelected = node.id === selected;
              return (
                <g key={node.id} onClick={() => setSelected(node.id)} style={{ cursor: "pointer" }}>
                  {isCenter ? (
                    <>
                      <circle cx={node.x} cy={node.y} r="9" fill="none" stroke="rgba(0,200,255,0.4)" strokeWidth="0.5" />
                      <circle cx={node.x} cy={node.y} r="7" fill="rgba(5,20,50,0.95)" stroke="rgba(0,200,255,0.7)" strokeWidth="0.5" />
                      <text x={node.x} y={node.y - 1.5} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="1.8" fontFamily="monospace">STATUS: ACTIVE</text>
                      <text x={node.x} y={node.y + 2.5} textAnchor="middle" fill="#fff" fontSize="2.8" fontWeight="bold">Mitigation</text>
                    </>
                  ) : (
                    <>
                      <rect
                        x={node.x - 8}
                        y={node.y - 2.5}
                        width={16}
                        height={5}
                        rx="1"
                        fill={isSelected ? "rgba(0,200,255,0.15)" : "rgba(5,20,50,0.9)"}
                        stroke={isSelected ? "rgba(0,200,255,0.6)" : "rgba(255,255,255,0.15)"}
                        strokeWidth="0.3"
                      />
                      <text x={node.x} y={node.y + 0.8} textAnchor="middle" fill={isSelected ? "#00c8ff" : "rgba(255,255,255,0.75)"} fontSize="2">
                        {node.label}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="graph-legend">
            <span className="legend-dot active-dot" /> Active Search
            <span className="legend-dot related-dot" /> Related Node
            <span className="legend-scroll">🖱 Scroll to Zoom</span>
          </div>
        </div>

        {def && (
          <aside className="definition-panel">
            <button className="def-close" onClick={() => setSelected("mitigation")}>✕</button>
            <div className="def-tags">
              {def.tags.map((t) => (
                <span key={t} className="def-tag">{t}</span>
              ))}
            </div>
            <h2 className="def-title">{def.title}</h2>
            <p className="def-body">{def.body}</p>

            <div className="def-section-label">KEY CONCEPTS</div>
            <ul className="def-concepts">
              {def.keyConcepts.map((c) => (
                <li key={c.name} className="concept-item">
                  <span className="concept-check">✔</span>
                  <div>
                    <div className="concept-name">{c.name}</div>
                    <div className="concept-desc">{c.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="def-section-label">RELATED ARTICLES</div>
            <ul className="def-related">
              {def.related.map((r) => (
                <li key={r} className="related-item">
                  <span>{r}</span>
                  <span>→</span>
                </li>
              ))}
            </ul>

            <div className="def-threat-map">
              <span className="threat-icon">📊</span>
              <span className="threat-label">Real-time Threat Map Loading...</span>
            </div>
          </aside>
        )}
      </main>
      <Footer />
    </div>
  );
}
