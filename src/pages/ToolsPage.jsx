import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ToolsPage.css";

// Nodes positioned to match the tree from the PDF
const GRAPH_NODES = [
  // CENTER
  { id: "cyberwiki", label: "CyberWiki", x: 50, y: 50, type: "root", slug: null },

  // Ataki i Zagrożenia branch (left-top)
  { id: "ataki", label: "Ataki i Zagrożenia", x: 28, y: 38, type: "branch", slug: null },
  { id: "sql-injection", label: "SQL Injection", x: 13, y: 24, type: "leaf", slug: "sql-injection" },
  { id: "ransomware", label: "Ransomware", x: 28, y: 20, type: "leaf", slug: "ransomware" },
  { id: "mitm", label: "Man in the Middle", x: 10, y: 32, type: "leaf", slug: "mitm" },
  { id: "csrf", label: "CSRF", x: 10, y: 44, type: "leaf", slug: "csrf" },
  { id: "zero-day", label: "Zero Day Exploit", x: 20, y: 50, type: "leaf", slug: "zero-day" },
  { id: "phishing", label: "Phishing", x: 30, y: 52, type: "leaf", slug: "phishing" },

  // Analiza i Forensics branch (left-bottom)
  { id: "analiza", label: "Analiza i Forensics", x: 26, y: 65, type: "branch", slug: null },
  { id: "threat-hunting", label: "Threat Hunting", x: 10, y: 60, type: "leaf", slug: "threat-hunting" },
  { id: "malware-analysis", label: "Malware Analysis", x: 22, y: 58, type: "leaf", slug: null },
  { id: "sandbox", label: "Sandbox", x: 10, y: 73, type: "leaf", slug: null },
  { id: "siem", label: "SIEM", x: 21, y: 76, type: "leaf", slug: "siem" },
  { id: "osint", label: "OSINT", x: 32, y: 73, type: "leaf", slug: "osint" },

  // Standardy i Regulacje branch (bottom)
  { id: "standardy", label: "Standardy i Regulacje", x: 43, y: 75, type: "branch", slug: null },
  { id: "nist", label: "NIST Framework", x: 28, y: 85, type: "leaf", slug: "nist-framework" },
  { id: "owasp", label: "OWASP top 10", x: 37, y: 87, type: "leaf", slug: null },
  { id: "nis2", label: "NIS2", x: 45, y: 88, type: "leaf", slug: null },
  { id: "cve", label: "CVE / CVSS", x: 53, y: 87, type: "leaf", slug: null },
  { id: "iso", label: "ISO 27001", x: 62, y: 85, type: "leaf", slug: null },

  // Kryptografia branch (top-center)
  { id: "krypto", label: "Kryptografia", x: 57, y: 28, type: "branch", slug: null },
  { id: "symetryczne", label: "Szyfrowanie symetryczne", x: 45, y: 15, type: "leaf", slug: null },
  { id: "ca", label: "CA", x: 60, y: 12, type: "leaf", slug: null },
  { id: "pki", label: "PKI", x: 50, y: 20, type: "leaf", slug: null },
  { id: "digital-sig", label: "Digital Signature", x: 60, y: 19, type: "leaf", slug: null },
  { id: "jwt", label: "JWT", x: 68, y: 16, type: "leaf", slug: null },
  { id: "oauth", label: "OAuth 2.0", x: 76, y: 16, type: "leaf", slug: null },

  // Sieci i Protokoły branch (right-top)
  { id: "sieci", label: "Sieci i Protokoły", x: 73, y: 38, type: "branch", slug: null },
  { id: "tcpip", label: "TCP/IP", x: 82, y: 28, type: "leaf", slug: null },
  { id: "tls-ssl", label: "TLS / SSL", x: 88, y: 33, type: "leaf", slug: "tls-ssl" },
  { id: "dns-poison", label: "DNS Poisoning", x: 90, y: 40, type: "leaf", slug: null },
  { id: "port-scan", label: "Port Scanning", x: 82, y: 47, type: "leaf", slug: null },
  { id: "packet-sniff", label: "Packet Sniffing", x: 88, y: 52, type: "leaf", slug: null },
  { id: "onion", label: "Onion Routing", x: 82, y: 57, type: "leaf", slug: null },

  // Mechanizmy Ochrony branch (right-bottom)
  { id: "ochrona", label: "Mechanizmy Ochrony", x: 75, y: 62, type: "branch", slug: null },
  { id: "firewall", label: "Firewall", x: 67, y: 73, type: "leaf", slug: "firewall" },
  { id: "ids-ips", label: "IDS / IPS", x: 77, y: 73, type: "leaf", slug: "ids-ips" },
  { id: "encryption", label: "Encryption", x: 87, y: 73, type: "leaf", slug: null },
  { id: "honeypot", label: "Honey Pot", x: 67, y: 83, type: "leaf", slug: null },
  { id: "vpn", label: "VPN", x: 77, y: 83, type: "leaf", slug: "vpn" },
  { id: "zero-trust", label: "Zero Trust", x: 87, y: 83, type: "leaf", slug: "zero-trust" },
];

// Edges: [from, to]
const EDGES = [
  // Root to branches
  ["cyberwiki", "ataki"], ["cyberwiki", "analiza"], ["cyberwiki", "standardy"],
  ["cyberwiki", "krypto"], ["cyberwiki", "sieci"], ["cyberwiki", "ochrona"],
  // Ataki leaves
  ["ataki", "sql-injection"], ["ataki", "ransomware"], ["ataki", "mitm"],
  ["ataki", "csrf"], ["ataki", "zero-day"], ["ataki", "phishing"],
  // Analiza leaves
  ["analiza", "threat-hunting"], ["analiza", "malware-analysis"],
  ["analiza", "sandbox"], ["analiza", "siem"], ["analiza", "osint"],
  // Standardy leaves
  ["standardy", "nist"], ["standardy", "owasp"], ["standardy", "nis2"],
  ["standardy", "cve"], ["standardy", "iso"],
  // Krypto leaves
  ["krypto", "symetryczne"], ["krypto", "ca"], ["krypto", "pki"],
  ["krypto", "digital-sig"], ["krypto", "jwt"], ["krypto", "oauth"],
  // Sieci leaves
  ["sieci", "tcpip"], ["sieci", "tls-ssl"], ["sieci", "dns-poison"],
  ["sieci", "port-scan"], ["sieci", "packet-sniff"], ["sieci", "onion"],
  // Ochrona leaves
  ["ochrona", "firewall"], ["ochrona", "ids-ips"], ["ochrona", "encryption"],
  ["ochrona", "honeypot"], ["ochrona", "vpn"], ["ochrona", "zero-trust"],
];

const DEFINITIONS = {
  cyberwiki: {
    tags: ["CENTRAL NODE"],
    title: "CyberWiki",
    body: "The central knowledge base for cybersecurity terminology. Navigate the tree to explore domains: Attacks, Analysis & Forensics, Cryptography, Networks, Protection Mechanisms, and Standards.",
    keyConcepts: [
      { name: "Interactive Tree", desc: "Click any node to explore its definition and connections." },
      { name: "Full Coverage", desc: "From offensive techniques to defensive frameworks." },
    ],
    related: [],
  },
  ataki: { tags: ["CATEGORY"], title: "Ataki i Zagrożenia", body: "The attacks and threats domain covers offensive techniques used by threat actors. Understanding attack methodologies is fundamental to building effective defenses.", keyConcepts: [{ name: "Attack Surface", desc: "All points where an attacker can enter or extract data." }, { name: "Threat Actor", desc: "Individual or group that carries out cyberattacks." }], related: [] },
  analiza: { tags: ["CATEGORY"], title: "Analiza i Forensics", body: "Digital forensics and analysis covers the collection, preservation and analysis of digital evidence. Threat hunting proactively seeks unknown threats in the environment.", keyConcepts: [{ name: "Chain of Custody", desc: "Documentation trail ensuring evidence integrity." }, { name: "IOC", desc: "Indicator of Compromise — artifact indicating breach." }], related: [] },
  standardy: { tags: ["CATEGORY", "COMPLIANCE"], title: "Standardy i Regulacje", body: "Security standards and regulations provide frameworks for implementing consistent, auditable security controls across organizations.", keyConcepts: [{ name: "Compliance", desc: "Meeting regulatory and framework requirements." }, { name: "Risk Assessment", desc: "Identifying and evaluating security risks." }], related: [] },
  krypto: { tags: ["CATEGORY", "CRYPTO"], title: "Kryptografia i Tożsamość", body: "Cryptography ensures confidentiality, integrity, and authenticity of data. Identity management controls who can access what resources.", keyConcepts: [{ name: "Asymmetric Encryption", desc: "Public/private key pairs for secure communication." }, { name: "PKI", desc: "Public Key Infrastructure for certificate management." }], related: [] },
  sieci: { tags: ["CATEGORY", "NETWORK"], title: "Sieci i Protokoły", body: "Network security covers protocols, topology security, and traffic analysis. Understanding network protocols is essential for both offense and defense.", keyConcepts: [{ name: "OSI Model", desc: "7-layer framework for network communication." }, { name: "Packet Analysis", desc: "Inspection of network packets for anomalies." }], related: [] },
  ochrona: { tags: ["CATEGORY", "DEFENSE"], title: "Mechanizmy Ochrony", body: "Protection mechanisms form the defensive layer of cybersecurity. They detect, prevent, and respond to attacks across the network and endpoint stack.", keyConcepts: [{ name: "Defense in Depth", desc: "Multiple overlapping security layers." }, { name: "Least Privilege", desc: "Granting minimum access required for a task." }], related: [] },
  "sql-injection": { tags: ["OFFENSIVE", "WEB"], title: "SQL Injection", body: "SQL injection exploits insufficient input validation to manipulate database queries, potentially exposing or destroying all data.", keyConcepts: [{ name: "Error-based SQLi", desc: "Extracts data through database error messages." }, { name: "Blind SQLi", desc: "Boolean or time-based inference without visible output." }], related: ["CSRF", "XSS"] },
  ransomware: { tags: ["MALWARE", "OFFENSIVE"], title: "Ransomware", body: "Ransomware encrypts victim files and demands cryptocurrency payment for decryption keys. Double-extortion variants also exfiltrate data before encrypting.", keyConcepts: [{ name: "RaaS", desc: "Ransomware-as-a-Service platform model." }, { name: "Air-gap Backup", desc: "Offline backups immune to network encryption." }], related: ["Phishing", "Zero-Day"] },
  mitm: { tags: ["OFFENSIVE", "NETWORK"], title: "Man in the Middle", body: "MitM attacks intercept communication between two parties. ARP poisoning, SSL stripping, and rogue AP are common techniques.", keyConcepts: [{ name: "ARP Spoofing", desc: "Poisoning LAN ARP tables to redirect traffic." }, { name: "SSL Stripping", desc: "Downgrading HTTPS connections to HTTP." }], related: ["TLS/SSL", "Phishing"] },
  csrf: { tags: ["OFFENSIVE", "WEB"], title: "CSRF", body: "Cross-Site Request Forgery forces authenticated users to submit unwanted requests. SameSite cookies and CSRF tokens are the primary defenses.", keyConcepts: [{ name: "CSRF Token", desc: "Unique, unpredictable value per session/request." }, { name: "SameSite Cookie", desc: "Prevents cookies from being sent cross-site." }], related: ["XSS", "SQL Injection"] },
  "zero-day": { tags: ["OFFENSIVE", "CRITICAL"], title: "Zero-Day Exploit", body: "Zero-day vulnerabilities are unknown to vendors, giving attackers a window of exploitation before patches are available.", keyConcepts: [{ name: "CVE", desc: "Common Vulnerabilities and Exposures identifier." }, { name: "Exploit Broker", desc: "Markets where zero-days are bought and sold." }], related: ["Ransomware", "CVE/CVSS"] },
  phishing: { tags: ["OFFENSIVE", "SOCIAL ENG"], title: "Phishing", body: "Phishing uses deceptive communications to steal credentials or install malware. Spear phishing targets specific individuals with personalized lures.", keyConcepts: [{ name: "Spear Phishing", desc: "Targeted phishing against specific individuals." }, { name: "Vishing", desc: "Voice phishing via phone calls." }], related: ["Ransomware", "CSRF"] },
  "threat-hunting": { tags: ["ANALYSIS", "PROACTIVE"], title: "Threat Hunting", body: "Threat hunting assumes compromise and proactively searches for hidden threats using MITRE ATT&CK TTPs, behavioral analytics, and forensic tools.", keyConcepts: [{ name: "MITRE ATT&CK", desc: "Framework of known adversary tactics and techniques." }, { name: "Hypothesis-driven", desc: "Starting hunt from an educated threat assumption." }], related: ["SIEM", "OSINT"] },
  "malware-analysis": { tags: ["ANALYSIS", "FORENSICS"], title: "Malware Analysis", body: "Malware analysis dissects malicious software to understand its behavior, capabilities, and indicators. Static analysis examines code; dynamic analysis runs the sample in a sandbox.", keyConcepts: [{ name: "Reverse Engineering", desc: "Decompiling malware to understand its logic." }, { name: "IOC Extraction", desc: "Identifying hashes, domains, IPs from malware." }], related: ["Sandbox", "Threat Hunting"] },
  sandbox: { tags: ["TOOLS", "ANALYSIS"], title: "Sandbox", body: "A sandbox is an isolated environment for safely executing suspicious files and monitoring their behavior without risking production systems.", keyConcepts: [{ name: "Dynamic Analysis", desc: "Running sample and observing runtime behavior." }, { name: "Evasion", desc: "Malware techniques to detect sandbox environments." }], related: ["Malware Analysis", "IDS/IPS"] },
  siem: { tags: ["DEFENSE", "SOC"], title: "SIEM", body: "SIEM aggregates and correlates security logs from all sources to detect threats in real-time, enabling SOC analysts to investigate and respond efficiently.", keyConcepts: [{ name: "Correlation Rules", desc: "Logic connecting disparate events into incidents." }, { name: "SOAR", desc: "Automated response playbooks extending SIEM." }], related: ["IDS/IPS", "Threat Hunting"] },
  osint: { tags: ["TOOLS", "RECON"], title: "OSINT", body: "Open Source Intelligence collects actionable information from public sources. Used offensively for reconnaissance and defensively for threat intelligence.", keyConcepts: [{ name: "Shodan", desc: "Search engine for internet-connected devices." }, { name: "OSINT Framework", desc: "Structured collection of OSINT data sources." }], related: ["Threat Hunting", "Phishing"] },
  nist: { tags: ["STANDARD"], title: "NIST Framework", body: "NIST CSF 2.0 provides six functions: Govern, Identify, Protect, Detect, Respond, Recover — giving organizations a structured approach to cybersecurity maturity.", keyConcepts: [{ name: "Maturity Levels", desc: "Tiers from partial (1) to adaptive (4)." }, { name: "CSF Profiles", desc: "Organization-specific framework implementation." }], related: ["ISO 27001", "Zero Trust"] },
  owasp: { tags: ["STANDARD", "WEB"], title: "OWASP Top 10", body: "The OWASP Top 10 is the definitive list of the most critical web application security risks, updated regularly based on real-world data.", keyConcepts: [{ name: "A01 Broken Access Control", desc: "Most critical web risk — missing authorization checks." }, { name: "A03 Injection", desc: "SQL, OS, LDAP injection attacks." }], related: ["SQL Injection", "CSRF"] },
  "tls-ssl": { tags: ["CRYPTOGRAPHY", "NETWORK"], title: "TLS / SSL", body: "TLS encrypts data in transit, authenticates servers via certificates, and ensures data integrity. TLS 1.3 is the current standard with improved security and performance.", keyConcepts: [{ name: "Handshake", desc: "Negotiation of encryption parameters between peers." }, { name: "Certificate Pinning", desc: "Binding expected certificate to prevent MitM." }], related: ["VPN", "Man in the Middle"] },
  "ids-ips": { tags: ["DEFENSE", "DETECTION"], title: "IDS / IPS", body: "IDS detects and alerts on intrusions; IPS actively blocks them. Both use signature, anomaly, and behavioral detection methods.", keyConcepts: [{ name: "Signature Detection", desc: "Matching known attack patterns." }, { name: "Anomaly Detection", desc: "Identifying deviations from learned baselines." }], related: ["Firewall", "SIEM"] },
  firewall: { tags: ["DEFENSE", "NETWORK"], title: "Firewall", body: "Firewalls filter network traffic based on rules. Next-Generation Firewalls add DPI, application awareness, and integrated IPS capabilities.", keyConcepts: [{ name: "Stateful Inspection", desc: "Tracking active connections for intelligent filtering." }, { name: "NGFW", desc: "Next-Generation Firewall with application awareness." }], related: ["IDS/IPS", "Zero Trust"] },
  vpn: { tags: ["DEFENSE", "NETWORK"], title: "VPN", body: "VPN creates encrypted tunnels over public networks. WireGuard, IPSec, and OpenVPN are common protocols. ZTNA is increasingly replacing traditional VPN.", keyConcepts: [{ name: "Split Tunneling", desc: "Routing only corporate traffic through VPN." }, { name: "WireGuard", desc: "Modern VPN protocol with minimal attack surface." }], related: ["Zero Trust", "Firewall"] },
  "zero-trust": { tags: ["DEFENSE", "ARCHITECTURE"], title: "Zero Trust", body: "Zero Trust: never trust, always verify. Every request is authenticated, authorized, and validated regardless of network location.", keyConcepts: [{ name: "Microsegmentation", desc: "Dividing network into isolated security zones." }, { name: "Continuous Validation", desc: "Ongoing verification of user and device trust." }], related: ["VPN", "Firewall", "NIST Framework"] },
};

const nodeById = Object.fromEntries(GRAPH_NODES.map(n => [n.id, n]));

export default function ToolsPage() {
  const [selected, setSelected] = useState("cyberwiki");
  const [search, setSearch] = useState("");
  const def = DEFINITIONS[selected] || DEFINITIONS["cyberwiki"];

  const filteredNodes = search
    ? GRAPH_NODES.filter(n => n.label.toLowerCase().includes(search.toLowerCase()))
    : null;

  const highlight = filteredNodes ? new Set(filteredNodes.map(n => n.id)) : null;

  const getNodeColor = (node) => {
    if (node.id === selected) return { fill: "rgba(0,200,255,0.25)", stroke: "rgba(0,200,255,0.9)", text: "#00c8ff" };
    if (highlight && !highlight.has(node.id)) return { fill: "rgba(5,15,35,0.5)", stroke: "rgba(255,255,255,0.05)", text: "rgba(255,255,255,0.2)" };
    if (node.type === "root") return { fill: "rgba(5,20,60,0.95)", stroke: "rgba(0,200,255,0.6)", text: "#ffffff" };
    if (node.type === "branch") {
      const colors = { ataki: "#ff4444", analiza: "#ff8c00", standardy: "#a855f7", krypto: "#22c55e", sieci: "#3b82f6", ochrona: "#fbbf24" };
      const c = colors[node.id] || "#00c8ff";
      return { fill: `${c}22`, stroke: `${c}88`, text: c };
    }
    return { fill: "rgba(5,20,50,0.9)", stroke: "rgba(255,255,255,0.15)", text: "rgba(255,255,255,0.75)" };
  };

  return (
    <div className="page-wrapper">
      <title>Interactive Terminology Map Page</title>
      <Navbar />
      <main className="tools-main">
        <div className="graph-container">
          <div className="graph-search-bar">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search nodes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
          </div>

          <svg className="graph-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {EDGES.map(([a, b], i) => {
              const na = nodeById[a], nb = nodeById[b];
              if (!na || !nb) return null;
              const faded = highlight && (!highlight.has(a) || !highlight.has(b));
              return (
                <line key={i}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={faded ? "rgba(255,255,255,0.03)" : "rgba(0,200,255,0.18)"}
                  strokeWidth="0.25"
                />
              );
            })}

            {GRAPH_NODES.map((node) => {
              const c = getNodeColor(node);
              const isSelected = node.id === selected;
              const labelLen = node.label.length;
              const boxW = Math.min(Math.max(labelLen * 1.1, 14), 22);
              const boxH = node.type === "root" ? 7 : 4.5;

              if (node.type === "root") {
                return (
                  <g key={node.id} onClick={() => setSelected(node.id)} style={{ cursor: "pointer" }}>
                    <circle cx={node.x} cy={node.y} r="6.5" fill={c.fill} stroke={c.stroke} strokeWidth="0.5" />
                    {isSelected && <circle cx={node.x} cy={node.y} r="8" fill="none" stroke="rgba(0,200,255,0.25)" strokeWidth="0.4" />}
                    <text x={node.x} y={node.y - 1} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="1.5" fontFamily="monospace">CYBERWIKI</text>
                    <text x={node.x} y={node.y + 2.5} textAnchor="middle" fill="#00c8ff" fontSize="2.8" fontWeight="bold">Wiki</text>
                  </g>
                );
              }

              return (
                <g key={node.id} onClick={() => node.id !== selected && setSelected(node.id)} style={{ cursor: "pointer" }}>
                  <rect
                    x={node.x - boxW / 2} y={node.y - boxH / 2}
                    width={boxW} height={boxH}
                    rx={node.type === "branch" ? 1.2 : 0.8}
                    fill={c.fill} stroke={c.stroke} strokeWidth={isSelected ? 0.5 : 0.3}
                  />
                  {node.slug && (
                    <rect x={node.x - boxW / 2} y={node.y - boxH / 2} width={2} height={boxH}
                      rx="0.6" fill={c.stroke} opacity="0.7" />
                  )}
                  <text
                    x={node.x + (node.slug ? 1.2 : 0)} y={node.y + 0.8}
                    textAnchor="middle" fill={c.text}
                    fontSize={node.type === "branch" ? 2 : 1.7}
                    fontWeight={node.type === "branch" ? "bold" : "normal"}
                  >
                    {node.label.length > 16 ? node.label.substring(0, 15) + "…" : node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="graph-legend">
            <span className="legend-dot active-dot" /> Selected
            <span className="legend-dot branch-dot" /> Category
            <span className="legend-dot leaf-dot" /> Term
            <span className="legend-link-hint">📌 Nodes with left bar = has article</span>
          </div>
        </div>

        <aside className="definition-panel">
          <div className="def-tags">
            {def.tags?.map((t) => (
              <span key={t} className="def-tag">{t}</span>
            ))}
          </div>
          <h2 className="def-title">{def.title}</h2>
          <p className="def-body">{def.body}</p>

          <div className="def-section-label">KEY CONCEPTS</div>
          <ul className="def-concepts">
            {def.keyConcepts?.map((c) => (
              <li key={c.name} className="concept-item">
                <span className="concept-check">✔</span>
                <div>
                  <div className="concept-name">{c.name}</div>
                  <div className="concept-desc">{c.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          {def.related?.length > 0 && (
            <>
              <div className="def-section-label">RELATED CONCEPTS</div>
              <ul className="def-related">
                {def.related.map((r) => (
                  <li key={r} className="related-item">
                    <span>{r}</span>
                    <span>→</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {GRAPH_NODES.find(n => n.id === selected)?.slug && (
            <Link
              to={`/article/${GRAPH_NODES.find(n => n.id === selected).slug}`}
              className="def-article-btn"
            >
              📄 Read Full Article →
            </Link>
          )}

          <div className="def-threat-map">
            <span className="threat-icon">📊</span>
            <span className="threat-label">Real-time Threat Map Loading...</span>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
