import { createBrowserClient } from "@supabase/ssr";
import { getGuestData, clearGuestData, hasGuestData, setGuestMode } from "./guest-store";
import { TABLES } from "./supabase/constants";

export async function migrateGuestData(): Promise<number> {
    if (!hasGuestData()) return 0;

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const data = getGuestData();
    let migrated = 0;

    // Migrate templates
    const templateIdMap = new Map<string, string>();
    for (const template of data.templates) {
        const { data: inserted } = await supabase
            .from(TABLES.TEMPLATES)
            .insert({ user_id: user.id, name: template.name, config: template.config })
            .select("id")
            .single();
        if (inserted) {
            templateIdMap.set(template.id, inserted.id);
            migrated++;
        }
    }

    // Migrate companies and people
    for (const company of data.companies) {
        const { data: inserted } = await supabase
            .from(TABLES.COMPANIES)
            .insert({
                user_id: user.id,
                name: company.name,
                domain: company.domain,
                website: company.website,
                logo_url: null, // Guest logos are blob URLs, can't migrate
            })
            .select("id")
            .single();

        if (inserted) {
            migrated++;

            // Migrate people for this company
            const people = data.people.filter((p) => p.company_id === company.id);
            for (const person of people) {
                const newTemplateId = templateIdMap.get(person.template_id) ?? null;
                await supabase.from(TABLES.PEOPLE).insert({
                    company_id: inserted.id,
                    template_id: newTemplateId,
                    first_name: person.first_name,
                    last_name: person.last_name,
                    title: person.title,
                    email: person.email,
                    phone: person.phone,
                    photo_url: null, // Guest photos are blob URLs, can't migrate
                });
                migrated++;
            }
        }
    }

    // Clean up guest data
    clearGuestData();
    setGuestMode(false);
    document.cookie = "cardgen_guest=;path=/;max-age=0";

    return migrated;
}
