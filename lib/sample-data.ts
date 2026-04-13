function logoSvgDataUrl(letter: string, color: string): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" rx="32" fill="${color}"/>
        <text x="100" y="125" text-anchor="middle" font-family="system-ui,sans-serif" font-size="100" font-weight="700" fill="#fff">${letter}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const SAMPLE_COMPANIES = [
    {
        name: "Acme Corp",
        domain: "acme.com",
        website: "https://acme.com",
        logoDataUrl: logoSvgDataUrl("A", "#1e3a5f"),
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
        logoDataUrl: logoSvgDataUrl("N", "#7c3aed"),
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
        logoDataUrl: logoSvgDataUrl("G", "#16a34a"),
        people: [
            { first_name: "Alex", last_name: "Morgan", title: "Founder", email: "alex@greenleaf.studio", phone: "+44 7700 900100", avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg" },
            { first_name: "Priya", last_name: "Sharma", title: "Senior Developer", email: "priya@greenleaf.studio", phone: "+44 7700 900101", avatarUrl: "https://randomuser.me/api/portraits/women/90.jpg" },
        ],
    },
];
