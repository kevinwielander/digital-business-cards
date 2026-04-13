function logoSvgDataUrl(name: string, color: string, style: "wordmark" | "icon-word" | "stacked"): string {
    let svg: string;

    if (style === "wordmark") {
        // Wide horizontal wordmark
        svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80" viewBox="0 0 320 80">
            <rect width="320" height="80" rx="8" fill="${color}"/>
            <text x="160" y="50" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="32" font-weight="800" fill="#fff" letter-spacing="2">${name.toUpperCase()}</text>
        </svg>`;
    } else if (style === "icon-word") {
        // Icon + text side by side
        const initial = name[0];
        svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="70" viewBox="0 0 300 70">
            <rect x="0" y="5" width="60" height="60" rx="14" fill="${color}"/>
            <text x="30" y="45" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="30" font-weight="800" fill="#fff">${initial}</text>
            <text x="80" y="47" font-family="system-ui,-apple-system,sans-serif" font-size="28" font-weight="700" fill="${color}">${name}</text>
        </svg>`;
    } else {
        // Stacked: icon on top, text below
        const initial = name[0];
        svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="60" r="40" fill="${color}"/>
            <text x="80" y="72" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="32" font-weight="800" fill="#fff">${initial}</text>
            <text x="80" y="130" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="18" font-weight="700" fill="${color}">${name}</text>
        </svg>`;
    }

    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const SAMPLE_COMPANIES = [
    {
        name: "Acme Corp",
        domain: "acme.com",
        website: "https://acme.com",
        logoDataUrl: logoSvgDataUrl("ACME", "#1e3a5f", "wordmark"),
        people: [
            { first_name: "Sarah", last_name: "Chen", title: "CEO", email: "sarah@acme.com", phone: "+1 555 100 2000", avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg" },
            { first_name: "Marcus", last_name: "Rivera", title: "CTO", email: "marcus@acme.com", phone: "+1 555 100 2001", avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg" },
            { first_name: "Emily", last_name: "Watson", title: "Head of Design", email: "emily@acme.com", phone: "+1 555 100 2002", avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg" },
            { first_name: "James", last_name: "Park", title: "Lead Engineer", email: "james@acme.com", phone: "+1 555 100 2003", avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg" },
        ],
    },
    {
        name: "Nova Digital",
        domain: "novadigital.io",
        website: "https://novadigital.io",
        logoDataUrl: logoSvgDataUrl("Nova Digital", "#7c3aed", "icon-word"),
        people: [
            { first_name: "Lisa", last_name: "Andersen", title: "Managing Director", email: "lisa@novadigital.io", phone: "+49 170 123 4567", avatarUrl: "https://randomuser.me/api/portraits/women/17.jpg" },
            { first_name: "Tom", last_name: "Bauer", title: "Creative Director", email: "tom@novadigital.io", phone: "+49 170 123 4568", avatarUrl: "https://randomuser.me/api/portraits/men/46.jpg" },
            { first_name: "Nina", last_name: "Schmidt", title: "Account Manager", email: "nina@novadigital.io", phone: "+49 170 123 4569", avatarUrl: "https://randomuser.me/api/portraits/women/55.jpg" },
        ],
    },
    {
        name: "Greenleaf Studios",
        domain: "greenleaf.studio",
        website: "https://greenleaf.studio",
        logoDataUrl: logoSvgDataUrl("Greenleaf", "#16a34a", "stacked"),
        people: [
            { first_name: "Alex", last_name: "Morgan", title: "Founder", email: "alex@greenleaf.studio", phone: "+44 7700 900100", avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg" },
            { first_name: "Priya", last_name: "Sharma", title: "Senior Developer", email: "priya@greenleaf.studio", phone: "+44 7700 900101", avatarUrl: "https://randomuser.me/api/portraits/women/90.jpg" },
        ],
    },
];
