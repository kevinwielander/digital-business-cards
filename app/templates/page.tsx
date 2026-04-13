import { createClient } from "@/lib/supabase/server";
import { TABLES } from "@/lib/supabase/constants";
import GuestTemplatesPage from "@/app/components/GuestTemplatesPage";
import TemplatesContent from "@/app/components/TemplatesContent";

export default async function TemplatesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return <GuestTemplatesPage />;

    const { data: userTemplates } = await supabase
        .from(TABLES.TEMPLATES)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const { data: sampleTemplates } = await supabase
        .from(TABLES.TEMPLATES)
        .select("*")
        .eq("is_sample", true)
        .order("created_at", { ascending: true });

    return (
        <TemplatesContent
            userTemplates={userTemplates ?? []}
            sampleTemplates={sampleTemplates ?? []}
        />
    );
}
