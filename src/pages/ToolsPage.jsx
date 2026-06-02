import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ToolsPage.css";

// Canvas size
const W = 2600;
const H = 1700;

// All nodes with absolute pixel positions on the canvas
const NODES = [
  // ROOT
  { id: "root",        label: "CyberWiki",            x: 1300, y: 850, type: "root",   slug: null },

  // BRANCHES
  { id: "ataki",       label: "Ataki i Zagrożenia",   x: 480,  y: 420, type: "branch", slug: null, color: "#ff4444" },
  { id: "analiza",     label: "Analiza i Forensics",  x: 480,  y: 1120, type: "branch", slug: null, color: "#ff8c00" },
  { id: "standardy",   label: "Standardy i Regulacje",x: 1000, y: 1460, type: "branch", slug: null, color: "#a855f7" },
  { id: "krypto",      label: "Kryptografia",         x: 1300, y: 200,  type: "branch", slug: null, color: "#22c55e" },
  { id: "sieci",       label: "Sieci i Protokoły",    x: 2120, y: 420,  type: "branch", slug: null, color: "#3b82f6" },
  { id: "ochrona",     label: "Mechanizmy Ochrony",   x: 2120, y: 1120, type: "branch", slug: null, color: "#fbbf24" },

  // ATAKI leaves
  { id: "mitm",        label: "Man in the Middle",    x: 80,   y: 220,  type: "leaf",   slug: "mitm" },
  { id: "sqli",        label: "SQL Injection",        x: 220,  y: 120,  type: "leaf",   slug: "sql-injection" },
  { id: "ransomware",  label: "Ransomware",           x: 420,  y: 80,   type: "leaf",   slug: "ransomware" },
  { id: "csrf",        label: "CSRF",                 x: 80,   y: 440,  type: "leaf",   slug: "csrf" },
  { id: "zero-day",    label: "Zero-Day Exploit",     x: 200,  y: 600,  type: "leaf",   slug: "zero-day" },
  { id: "phishing",    label: "Phishing",             x: 420,  y: 640,  type: "leaf",   slug: "phishing" },

  // ANALIZA leaves
  { id: "threat",      label: "Threat Hunting",       x: 80,   y: 900,  type: "leaf",   slug: "threat-hunting" },
  { id: "malware",     label: "Malware Analysis",     x: 200,  y: 820,  type: "leaf",   slug: null },
  { id: "sandbox",     label: "Sandbox",              x: 80,   y: 1160, type: "leaf",   slug: null },
  { id: "siem",        label: "SIEM",                 x: 200,  y: 1280, type: "leaf",   slug: "siem" },
  { id: "osint",       label: "OSINT",                x: 420,  y: 1360, type: "leaf",   slug: "osint" },

  // STANDARDY leaves
  { id: "nist",        label: "NIST Framework",       x: 620,  y: 1580, type: "leaf",   slug: "nist-framework" },
  { id: "owasp",       label: "OWASP top 10",         x: 800,  y: 1610, type: "leaf",   slug: null },
  { id: "nis2",        label: "NIS2",                 x: 980,  y: 1620, type: "leaf",   slug: null },
  { id: "cve",         label: "CVE / CVSS",           x: 1160, y: 1610, type: "leaf",   slug: null },
  { id: "iso",         label: "ISO 27001",            x: 1340, y: 1580, type: "leaf",   slug: null },

  // KRYPTO leaves
  { id: "sym",         label: "Szyfrowanie symetryczne", x: 820,  y: 60,  type: "leaf",  slug: null },
  { id: "ca",          label: "CA",                   x: 1000, y: 40,   type: "leaf",   slug: null },
  { id: "pki",         label: "PKI",                  x: 960,  y: 160,  type: "leaf",   slug: null },
  { id: "digsig",      label: "Digital Signature",    x: 1160, y: 60,   type: "leaf",   slug: null },
  { id: "jwt",         label: "JWT",                  x: 1380, y: 50,   type: "leaf",   slug: null },
  { id: "oauth",       label: "OAuth 2.0",            x: 1560, y: 90,   type: "leaf",   slug: null },

  // SIECI leaves
  { id: "tcpip",       label: "TCP/IP",               x: 2360, y: 180,  type: "leaf",   slug: null },
  { id: "tls",         label: "TLS / SSL",            x: 2480, y: 320,  type: "leaf",   slug: "tls-ssl" },
  { id: "dns",         label: "DNS Poisoning",        x: 2500, y: 480,  type: "leaf",   slug: null },
  { id: "portscan",    label: "Port Scanning",        x: 2400, y: 620,  type: "leaf",   slug: null },
  { id: "sniff",       label: "Packet Sniffing",      x: 2260, y: 700,  type: "leaf",   slug: null },
  { id: "onion",       label: "Onion Routing",        x: 2080, y: 700,  type: "leaf",   slug: null },

  // OCHRONA leaves
  { id: "firewall",    label: "Firewall",             x: 1900, y: 1280, type: "leaf",   slug: "firewall" },
  { id: "idsips",      label: "IDS / IPS",            x: 2100, y: 1340, type: "leaf",   slug: "ids-ips" },
  { id: "encryption",  label: "Encryption",           x: 2300, y: 1280, type: "leaf",   slug: null },
  { id: "honeypot",    label: "Honey Pot",            x: 1900, y: 1460, type: "leaf",   slug: null },
  { id: "vpn",         label: "VPN",                  x: 2100, y: 1510, type: "leaf",   slug: "vpn" },
  { id: "zerotrust",   label: "Zero Trust",           x: 2300, y: 1460, type: "leaf",   slug: "zero-trust" },
];

const EDGES = [
  ["root","ataki"],["root","analiza"],["root","standardy"],["root","krypto"],["root","sieci"],["root","ochrona"],
  ["ataki","mitm"],["ataki","sqli"],["ataki","ransomware"],["ataki","csrf"],["ataki","zero-day"],["ataki","phishing"],
  ["analiza","threat"],["analiza","malware"],["analiza","sandbox"],["analiza","siem"],["analiza","osint"],
  ["standardy","nist"],["standardy","owasp"],["standardy","nis2"],["standardy","cve"],["standardy","iso"],
  ["krypto","sym"],["krypto","ca"],["krypto","pki"],["krypto","digsig"],["krypto","jwt"],["krypto","oauth"],
  ["sieci","tcpip"],["sieci","tls"],["sieci","dns"],["sieci","portscan"],["sieci","sniff"],["sieci","onion"],
  ["ochrona","firewall"],["ochrona","idsips"],["ochrona","encryption"],["ochrona","honeypot"],["ochrona","vpn"],["ochrona","zerotrust"],
];

const DEFS = {
  root:      { tags:["CENTRAL"], title:"CyberWiki — Domena Terminologii", body:"Interaktywna mapa pojęć cyberbezpieczeństwa. Kliknij dowolny węzeł aby zobaczyć definicję. Przeciągaj mapę myszą, używaj scrolla do zoomowania.", concepts:[{n:"Pan",d:"Przeciągnij tło myszą"},{n:"Zoom",d:"Scroll kółkiem myszy"},{n:"Reset",d:"Przycisk ↺ lub dwuklik"}] },
  ataki:     { tags:["KATEGORIA","OFFENSIVE"], title:"Ataki i Zagrożenia", body:"Techniki ofensywne stosowane przez cyberprzestępców. Znajomość wektorów ataku jest kluczowa dla budowania skutecznej obrony.", concepts:[{n:"Attack Vector",d:"Sposób dostępu do systemu"},{n:"Threat Actor",d:"Osoba lub grupa stojąca za atakiem"}] },
  analiza:   { tags:["KATEGORIA","FORENSICS"], title:"Analiza i Forensics", body:"Cyfrowa kryminalistyka i analiza incydentów. Obejmuje zbieranie dowodów, analizę złośliwego oprogramowania i proaktywne polowanie na zagrożenia.", concepts:[{n:"Chain of Custody",d:"Dokumentacja zachowania dowodów"},{n:"IOC",d:"Indicator of Compromise"}] },
  standardy: { tags:["KATEGORIA","COMPLIANCE"], title:"Standardy i Regulacje", body:"Ramy regulacyjne i standardy branżowe zapewniające spójne, audytowalne wdrożenia bezpieczeństwa.", concepts:[{n:"Compliance",d:"Zgodność z wymaganiami prawnymi"},{n:"Risk Assessment",d:"Ocena ryzyka organizacyjnego"}] },
  krypto:    { tags:["KATEGORIA","CRYPTO"], title:"Kryptografia i Tożsamość", body:"Kryptografia zapewnia poufność, integralność i autentyczność danych. Zarządzanie tożsamością kontroluje dostęp do zasobów.", concepts:[{n:"Asymetric Encryption",d:"Klucze publiczny/prywatny"},{n:"PKI",d:"Infrastruktura klucza publicznego"}] },
  sieci:     { tags:["KATEGORIA","NETWORK"], title:"Sieci i Protokoły", body:"Bezpieczeństwo sieci obejmuje protokoły, topologię i analizę ruchu sieciowego. Podstawa zarówno dla ofensywy jak i defensywy.", concepts:[{n:"OSI Model",d:"7-warstwowy model komunikacji"},{n:"Packet Analysis",d:"Inspekcja pakietów sieciowych"}] },
  ochrona:   { tags:["KATEGORIA","DEFENSE"], title:"Mechanizmy Ochrony", body:"Mechanizmy obronne tworzą warstwową ochronę systemu. Wykrywają, zapobiegają i reagują na ataki na poziomie sieci i endpointów.", concepts:[{n:"Defense in Depth",d:"Wiele nakładających się warstw ochrony"},{n:"Least Privilege",d:"Minimalny wymagany dostęp"}] },
  mitm:      { tags:["OFFENSIVE","NETWORK"], title:"Man in the Middle", body:"Atakujący przechwytuje komunikację między dwiema stronami. Techniki: ARP poisoning, SSL stripping, rogue AP.", concepts:[{n:"ARP Spoofing",d:"Zatrucie tablic ARP w sieci LAN"},{n:"SSL Stripping",d:"Downgrade HTTPS do HTTP"}], slug:"mitm" },
  sqli:      { tags:["OFFENSIVE","WEB","OWASP"], title:"SQL Injection", body:"Wstrzyknięcie złośliwych zapytań SQL do pól formularzy. Może ujawnić lub zniszczyć całą bazę danych.", concepts:[{n:"Error-based",d:"Ekstrakcja danych przez komunikaty błędów"},{n:"Blind SQLi",d:"Wnioskowanie przez odpowiedzi true/false"}], slug:"sql-injection" },
  ransomware:{ tags:["MALWARE","CRITICAL"], title:"Ransomware", body:"Szyfruje pliki ofiary i żąda okupu w kryptowalucie. Warianty double-extortion najpierw wykradają dane.", concepts:[{n:"RaaS",d:"Ransomware-as-a-Service"},{n:"Air-gap Backup",d:"Odizolowane kopie zapasowe"}], slug:"ransomware" },
  csrf:      { tags:["OFFENSIVE","WEB"], title:"CSRF", body:"Zmusza zalogowanego użytkownika do wykonania nieautoryzowanych akcji. Obrona: tokeny CSRF, SameSite cookies.", concepts:[{n:"CSRF Token",d:"Unikalny token per sesja"},{n:"SameSite",d:"Atrybut cookie blokujący cross-site"}], slug:"csrf" },
  "zero-day":{ tags:["OFFENSIVE","CRITICAL"], title:"Zero-Day Exploit", body:"Wykorzystuje lukę nieznaną producentowi. Brak łatki w momencie ataku — maksymalne ryzyko.", concepts:[{n:"CVE",d:"Common Vulnerabilities and Exposures"},{n:"Exploit Broker",d:"Rynki handlu zero-dayami"}], slug:"zero-day" },
  phishing:  { tags:["SOCIAL ENG","OFFENSIVE"], title:"Phishing", body:"Wyłudzanie danych przez fałszywe wiadomości podszywające się pod zaufane podmioty.", concepts:[{n:"Spear Phishing",d:"Celowany atak na konkretną osobę"},{n:"Vishing",d:"Phishing przez połączenie głosowe"}], slug:"phishing" },
  threat:    { tags:["ANALYSIS","PROACTIVE"], title:"Threat Hunting", body:"Proaktywne poszukiwanie ukrytych zagrożeń przy założeniu naruszenia. Używa MITRE ATT&CK i analizy behawioralnej.", concepts:[{n:"MITRE ATT&CK",d:"Baza taktyk i technik atakujących"},{n:"Hypothesis-driven",d:"Polowanie na podstawie hipotezy"}], slug:"threat-hunting" },
  malware:   { tags:["ANALYSIS","FORENSICS"], title:"Malware Analysis", body:"Analiza złośliwego oprogramowania: statyczna (kod) i dynamiczna (uruchomienie w sandboxie).", concepts:[{n:"Reverse Engineering",d:"Deasemblacja kodu złośliwego"},{n:"IOC Extraction",d:"Wydobycie wskaźników kompromitacji"}] },
  sandbox:   { tags:["TOOLS","ANALYSIS"], title:"Sandbox", body:"Izolowane środowisko do bezpiecznego uruchamiania podejrzanych plików i obserwacji zachowania.", concepts:[{n:"Dynamic Analysis",d:"Obserwacja zachowania w czasie rzeczywistym"},{n:"Evasion",d:"Techniki wykrywania środowisk sandbox"}] },
  siem:      { tags:["DEFENSE","SOC"], title:"SIEM", body:"Agreguje i koreluje logi z całego środowiska. Umożliwia wykrywanie zagrożeń w czasie rzeczywistym przez zespoły SOC.", concepts:[{n:"Korelacja",d:"Łączenie zdarzeń w incydenty"},{n:"SOAR",d:"Automatyczne playbooki reagowania"}], slug:"siem" },
  osint:     { tags:["TOOLS","RECON"], title:"OSINT", body:"Wywiad ze źródeł otwartych. Używany ofensywnie do rekonesansu i defensywnie do threat intelligence.", concepts:[{n:"Shodan",d:"Wyszukiwarka urządzeń IoT"},{n:"Google Dorking",d:"Zaawansowane zapytania wyszukiwarki"}], slug:"osint" },
  nist:      { tags:["STANDARD"], title:"NIST Framework", body:"NIST CSF 2.0: Govern, Identify, Protect, Detect, Respond, Recover — kompleksowe podejście do cyberbezpieczeństwa.", concepts:[{n:"Maturity Tiers",d:"Poziomy dojrzałości od 1 do 4"},{n:"CSF Profile",d:"Profil wdrożenia dla organizacji"}], slug:"nist-framework" },
  owasp:     { tags:["STANDARD","WEB"], title:"OWASP Top 10", body:"Lista 10 najważniejszych ryzyk dla aplikacji webowych, aktualizowana regularnie na podstawie danych z branży.", concepts:[{n:"A01 Broken Access Control",d:"Brakujące sprawdzenia autoryzacji"},{n:"A03 Injection",d:"SQL, OS, LDAP injection"}] },
  nis2:      { tags:["REGULATION","EU"], title:"NIS2", body:"Dyrektywa UE dotycząca bezpieczeństwa sieci i systemów informacyjnych. Rozszerza NIS1 o nowe sektory i surowsze kary.", concepts:[{n:"Critical Infrastructure",d:"Sektory kluczowe objęte dyrektywą"},{n:"Incident Reporting",d:"Obowiązek zgłaszania incydentów w 24h"}] },
  cve:       { tags:["STANDARD"], title:"CVE / CVSS", body:"CVE identyfikuje podatności; CVSS (0-10) ocenia ich krytyczność. Podstawa zarządzania podatnościami.", concepts:[{n:"CVSS Score",d:"0-3.9 Low, 4-6.9 Med, 7-8.9 High, 9-10 Critical"},{n:"NVD",d:"National Vulnerability Database"}] },
  iso:       { tags:["STANDARD","AUDIT"], title:"ISO 27001", body:"Międzynarodowy standard ISMS (Information Security Management System). Certyfikacja potwierdza systematyczne zarządzanie bezpieczeństwem.", concepts:[{n:"ISMS",d:"System zarządzania bezpieczeństwem informacji"},{n:"Risk Treatment",d:"Plan postępowania z ryzykiem"}] },
  sym:       { tags:["CRYPTO"], title:"Szyfrowanie symetryczne/asymetryczne", body:"Symetryczne używa jednego klucza (AES, ChaCha20). Asymetryczne używa pary kluczy (RSA, ECC). Hybrydy łączą oba podejścia.", concepts:[{n:"AES-256",d:"Standard szyfrowania symetrycznego"},{n:"RSA-4096",d:"Popularne szyfrowanie asymetryczne"}] },
  ca:        { tags:["CRYPTO","PKI"], title:"CA (Certificate Authority)", body:"Urząd certyfikacji wystawia i podpisuje certyfikaty cyfrowe. Tworzy łańcuch zaufania od Root CA przez Intermediate CA.", concepts:[{n:"Root CA",d:"Główny urząd certyfikacji"},{n:"Certificate Chain",d:"Łańcuch zaufania certyfikatów"}] },
  pki:       { tags:["CRYPTO"], title:"PKI (Public Key Infrastructure)", body:"System zarządzania kluczami publicznymi i certyfikatami. Umożliwia bezpieczną komunikację i weryfikację tożsamości.", concepts:[{n:"CRL",d:"Certificate Revocation List"},{n:"OCSP",d:"Online Certificate Status Protocol"}] },
  digsig:    { tags:["CRYPTO"], title:"Digital Signature", body:"Podpis cyfrowy zapewnia autentyczność i integralność. Używa klucza prywatnego do podpisywania, publicznego do weryfikacji.", concepts:[{n:"Non-repudiation",d:"Niemożność zaprzeczenia podpisaniu"},{n:"Hash Function",d:"SHA-256/512 do skrótu wiadomości"}] },
  jwt:       { tags:["CRYPTO","AUTH"], title:"JWT (JSON Web Token)", body:"Kompaktowy token do bezpiecznego przekazywania informacji. Składa się z Header.Payload.Signature zakodowanych w Base64.", concepts:[{n:"Claims",d:"Dane zawarte w tokenie (sub, iat, exp)"},{n:"HS256 vs RS256",d:"Symetryczny vs asymetryczny algorytm"}] },
  oauth:     { tags:["AUTH","PROTOCOL"], title:"OAuth 2.0", body:"Protokół autoryzacji umożliwiający dostęp do zasobów bez udostępniania hasła. OpenID Connect dodaje warstwę uwierzytelnienia.", concepts:[{n:"Access Token",d:"Token dostępu do API"},{n:"PKCE",d:"Proof Key for Code Exchange"}] },
  tcpip:     { tags:["NETWORK"], title:"TCP/IP", body:"Fundament komunikacji internetowej. TCP zapewnia niezawodne połączenie; UDP szybkie przesyłanie bez gwarancji dostarczenia.", concepts:[{n:"Three-Way Handshake",d:"SYN → SYN-ACK → ACK"},{n:"IP Routing",d:"Trasowanie pakietów przez sieć"}] },
  tls:       { tags:["CRYPTO","NETWORK"], title:"TLS / SSL", body:"Protokół szyfrowania warstwy transportowej. TLS 1.3 jest aktualnym standardem z ulepszoną wydajnością i bezpieczeństwem.", concepts:[{n:"Handshake",d:"Negocjacja parametrów szyfrowania"},{n:"Certificate Pinning",d:"Przypinanie certyfikatu zapobiega MitM"}], slug:"tls-ssl" },
  dns:       { tags:["NETWORK","OFFENSIVE"], title:"DNS Poisoning", body:"Zatrucie pamięci podręcznej DNS przekierowuje ruch na złośliwe serwery. DNSSEC podpisuje rekordy DNS kryptograficznie.", concepts:[{n:"Cache Poisoning",d:"Fałszywe rekordy DNS w cache"},{n:"DNSSEC",d:"Kryptograficzne podpisywanie DNS"}] },
  portscan:  { tags:["RECON","TOOLS"], title:"Port Scanning", body:"Technika rekonesansu wykrywająca otwarte porty i usługi. Nmap to najpopularniejsze narzędzie.", concepts:[{n:"SYN Scan",d:"Szybki scan bez pełnego połączenia"},{n:"Service Detection",d:"Identyfikacja wersji usług (-sV)"}] },
  sniff:     { tags:["NETWORK","OFFENSIVE"], title:"Packet Sniffing", body:"Przechwytywanie ruchu sieciowego. W sieciach przełączanych wymaga najpierw MitM (ARP poisoning).", concepts:[{n:"Promiscuous Mode",d:"Tryb karty sieciowej odbierającej wszystko"},{n:"Wireshark",d:"GUI do analizy pakietów"}] },
  onion:     { tags:["NETWORK","PRIVACY"], title:"Onion Routing", body:"Wielowarstwowe szyfrowanie przekierowujące ruch przez wiele węzłów. Tor implementuje onion routing dla anonimowości.", concepts:[{n:"Tor Network",d:"Sieć anonimizująca ruch"},{n:"Exit Node",d:"Ostatni węzeł Tor komunikujący się z celem"}] },
  firewall:  { tags:["DEFENSE","NETWORK"], title:"Firewall", body:"Filtruje ruch sieciowy na podstawie reguł. NGFW dodaje inspekcję warstwy aplikacji, DPI i integrację z IPS.", concepts:[{n:"Stateful Inspection",d:"Śledzenie aktywnych połączeń"},{n:"NGFW",d:"Next-Generation Firewall z DPI"}], slug:"firewall" },
  idsips:    { tags:["DEFENSE","DETECTION"], title:"IDS / IPS", body:"IDS wykrywa i alarmuje; IPS aktywnie blokuje zagrożenia. Wykrywanie sygnaturowe i anomalie behawioralne.", concepts:[{n:"Signature Detection",d:"Dopasowanie znanych wzorców ataku"},{n:"Anomaly Detection",d:"Odchylenia od wyuczonej normy"}], slug:"ids-ips" },
  encryption:{ tags:["CRYPTO","DEFENSE"], title:"Encryption", body:"Szyfrowanie danych w spoczynku i w tranzycie. AES-256 dla danych; TLS dla transmisji; end-to-end dla komunikacji.", concepts:[{n:"At Rest",d:"Szyfrowanie przechowywanych danych"},{n:"In Transit",d:"Szyfrowanie danych podczas przesyłu"}] },
  honeypot:  { tags:["DEFENSE","DECEPTION"], title:"Honey Pot", body:"Pułapka imitująca prawdziwy system. Przyciąga atakujących, zbiera informacje o technikach bez ryzyka dla produkcji.", concepts:[{n:"High Interaction",d:"Realne systemy jako pułapki"},{n:"Canary Token",d:"Pliki/linki informujące o dostępie"}] },
  vpn:       { tags:["DEFENSE","NETWORK"], title:"VPN", body:"Zaszyfrowany tunel przez sieć publiczną. WireGuard, IPSec, OpenVPN. ZTNA zastępuje tradycyjny VPN w Zero Trust.", concepts:[{n:"Split Tunneling",d:"Tylko ruch korporacyjny przez VPN"},{n:"WireGuard",d:"Nowoczesny protokół VPN"}], slug:"vpn" },
  zerotrust: { tags:["DEFENSE","ARCHITECTURE"], title:"Zero Trust", body:"Nigdy nie ufaj, zawsze weryfikuj. Każde żądanie wymaga uwierzytelnienia niezależnie od lokalizacji sieciowej.", concepts:[{n:"Microsegmentation",d:"Izolacja segmentów sieci"},{n:"Continuous Validation",d:"Ciągła weryfikacja zaufania"}], slug:"zero-trust" },
};

const nodeById = Object.fromEntries(NODES.map(n => [n.id, n]));
const BRANCH_COLORS = { ataki:"#ff4444", analiza:"#ff8c00", standardy:"#a855f7", krypto:"#22c55e", sieci:"#3b82f6", ochrona:"#fbbf24" };

// Find parent branch for a leaf
function getBranchColor(nodeId) {
  for (const [from, to] of EDGES) {
    if (to === nodeId) {
      const parent = nodeById[from];
      if (parent?.type === "branch") return parent.color;
      if (parent?.type === "root") return "#00c8ff";
      // leaf's parent is branch — check grandparent
      for (const [f2, t2] of EDGES) {
        if (t2 === from && nodeById[f2]?.type === "branch") return nodeById[f2].color;
      }
    }
  }
  return "#00c8ff";
}

const INIT = { x: -80, y: -60, scale: 0.52 };

export default function ToolsPage() {
  const [selected, setSelected] = useState("root");
  const [search, setSearch] = useState("");
  const [transform, setTransform] = useState(INIT);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef();

  const def = DEFS[selected] || DEFS["root"];
  const selNode = nodeById[selected];

  const matchIds = search
    ? new Set(NODES.filter(n => n.label.toLowerCase().includes(search.toLowerCase())).map(n => n.id))
    : null;

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    containerRef.current.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setTransform(p => ({ ...p, x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    if (containerRef.current) containerRef.current.style.cursor = "grab";
  }, []);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    setTransform(p => {
      const ns = Math.min(Math.max(p.scale * factor, 0.15), 3);
      const ratio = ns / p.scale;
      return { x: mx - ratio * (mx - p.x), y: my - ratio * (my - p.y), scale: ns };
    });
  }, []);

  const resetView = () => setTransform(INIT);

  const handleNodeClick = (id, e) => {
    e.stopPropagation();
    setSelected(id);
  };

  return (
    <div className="page-wrapper">
      <title>Interactive Terminology Map Page</title>
      <Navbar />
      <main className="tools-main">
        {/* MAP */}
        <div
          className="graph-container"
          ref={containerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
          style={{ cursor: "grab" }}
        >
          {/* Search bar */}
          <div className="graph-search-bar" onMouseDown={e => e.stopPropagation()}>
            <span>🔍</span>
            <input
              type="text" placeholder="Szukaj węzła..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
          </div>

          {/* Controls */}
          <div className="graph-controls" onMouseDown={e => e.stopPropagation()}>
            <button onClick={() => setTransform(p => ({ ...p, scale: Math.min(p.scale * 1.2, 3) }))} title="Zoom in">+</button>
            <button onClick={() => setTransform(p => ({ ...p, scale: Math.max(p.scale * 0.8, 0.15) }))} title="Zoom out">−</button>
            <button onClick={resetView} title="Reset view">↺</button>
          </div>

          <svg
            width="100%" height="100%"
            style={{ display: "block", userSelect: "none" }}
          >
            <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
              {/* Edges */}
              {EDGES.map(([a, b], i) => {
                const na = nodeById[a], nb = nodeById[b];
                if (!na || !nb) return null;
                const faded = matchIds && (!matchIds.has(a) && !matchIds.has(b));
                const branchColor = getBranchColor(b) || "#00c8ff";
                return (
                  <line key={i}
                    x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke={faded ? "rgba(255,255,255,0.03)" : `${branchColor}44`}
                    strokeWidth={na.type === "root" ? 2 : 1.2}
                    strokeDasharray={nb.type === "leaf" ? "8 4" : "none"}
                  />
                );
              })}

              {/* Nodes */}
              {NODES.map(node => {
                const isSelected = node.id === selected;
                const faded = matchIds && !matchIds.has(node.id);
                const branchColor = node.type === "branch" ? node.color : getBranchColor(node.id);

                if (node.type === "root") {
                  return (
                    <g key={node.id} onClick={e => handleNodeClick(node.id, e)} style={{ cursor: "pointer" }}>
                      {isSelected && <circle cx={node.x} cy={node.y} r={62} fill="none" stroke="rgba(0,200,255,0.3)" strokeWidth={2} />}
                      <circle cx={node.x} cy={node.y} r={52} fill="rgba(5,20,60,0.95)" stroke="#00c8ff" strokeWidth={isSelected ? 3 : 1.5} opacity={faded ? 0.2 : 1} />
                      <text x={node.x} y={node.y - 10} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={12} fontFamily="monospace" letterSpacing="2">CENTRAL</text>
                      <text x={node.x} y={node.y + 14} textAnchor="middle" fill="#00c8ff" fontSize={20} fontWeight="bold">CyberWiki</text>
                    </g>
                  );
                }

                const bw = node.label.length > 14 ? 190 : Math.max(node.label.length * 11 + 24, 120);
                const bh = node.type === "branch" ? 42 : 36;

                return (
                  <g key={node.id} onClick={e => handleNodeClick(node.id, e)} style={{ cursor: "pointer" }} opacity={faded ? 0.18 : 1}>
                    {isSelected && (
                      <rect x={node.x - bw/2 - 5} y={node.y - bh/2 - 5} width={bw + 10} height={bh + 10}
                        rx={node.type === "branch" ? 10 : 7} fill="none" stroke={branchColor} strokeWidth={2} opacity={0.5}
                      />
                    )}
                    <rect
                      x={node.x - bw/2} y={node.y - bh/2} width={bw} height={bh}
                      rx={node.type === "branch" ? 8 : 5}
                      fill={isSelected ? `${branchColor}30` : "rgba(5,20,50,0.92)"}
                      stroke={isSelected ? branchColor : `${branchColor}66`}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    {node.slug && (
                      <rect x={node.x - bw/2} y={node.y - bh/2} width={4} height={bh} rx={4} fill={branchColor} opacity={0.9} />
                    )}
                    <text
                      x={node.x + (node.slug ? 3 : 0)} y={node.y + (node.type === "branch" ? 6 : 5)}
                      textAnchor="middle"
                      fill={isSelected ? branchColor : (node.type === "branch" ? branchColor : "rgba(255,255,255,0.82)")}
                      fontSize={node.type === "branch" ? 15 : 13}
                      fontWeight={node.type === "branch" ? "700" : "400"}
                      fontFamily="Inter, system-ui, sans-serif"
                    >
                      {node.label.length > 18 ? node.label.substring(0, 17) + "…" : node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          <div className="graph-legend">
            <span><span className="ldot" style={{ background: "#00c8ff" }} /> Wybrany</span>
            <span><span className="ldot" style={{ background: "#a855f7" }} /> Kategoria</span>
            <span><span className="ldot" style={{ background: "rgba(255,255,255,0.4)" }} /> Termin</span>
            <span className="lgray">█ Pasek = ma artykuł</span>
          </div>
        </div>

        {/* DEFINITION PANEL */}
        <aside className="definition-panel">
          <div className="def-tags">
            {def.tags?.map(t => <span key={t} className="def-tag">{t}</span>)}
          </div>
          <h2 className="def-title">{def.title}</h2>
          <p className="def-body">{def.body}</p>

          <div className="def-section-label">KLUCZOWE POJĘCIA</div>
          <ul className="def-concepts">
            {def.concepts?.map(c => (
              <li key={c.n} className="concept-item">
                <span className="concept-check">✔</span>
                <div>
                  <div className="concept-name">{c.n}</div>
                  <div className="concept-desc">{c.d}</div>
                </div>
              </li>
            ))}
          </ul>

          {selNode?.slug && (
            <Link to={`/article/${selNode.slug}`} className="def-article-btn">
              📄 Czytaj pełny artykuł →
            </Link>
          )}

          <div className="def-threat-map">
            <span className="threat-icon">📊</span>
            <span>Real-time Threat Map Loading...</span>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
