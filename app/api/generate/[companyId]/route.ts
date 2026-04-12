import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import JSZip from "jszip";
import type { TemplateConfig } from "@/lib/types";

async function imageToBase64(supabase: Awaited<ReturnType<typeof createClient>>, bucket: string, path: string): Promise<string | null> {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error || !data) return null;
    const buffer = Buffer.from(await data.arrayBuffer());
    const ext = path.split(".").pop()?.toLowerCase() ?? "png";
    const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "svg" ? "image/svg+xml" : `image/${ext}`;
    return `data:${mime};base64,${buffer.toString("base64")}`;
}

function renderCardHtml(
    person: { first_name: string; last_name: string; title: string; email: string; phone: string },
    company: { name: string; domain: string },
    config: TemplateConfig,
    logoBase64: string | null,
    photoBase64: string | null,
): string {
    const isHorizontal = config.layout === "horizontal";
    const fullName = `${person.first_name} ${person.last_name}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${fullName} - ${company.name}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f4f4f5; font-family: ${config.fontFamily}; }
.card { background: ${config.backgroundColor}; color: ${config.textColor}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); width: ${isHorizontal ? "500px" : "300px"}; }
.header { display: flex; align-items: center; justify-content: center; padding: 16px; background: ${config.accentColor}; }
.header-logo { height: 40px; object-fit: contain; filter: brightness(0) invert(1); }
.header-text { font-size: 18px; font-weight: 700; color: #fff; }
.accent { height: 6px; background: ${config.accentColor}; }
.content { display: flex; gap: 16px; padding: 24px; ${isHorizontal ? "flex-direction: row; align-items: center;" : "flex-direction: column; align-items: center; text-align: center;"} }
.avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.avatar-placeholder { width: 64px; height: 64px; border-radius: 50%; background: ${config.accentColor}; opacity: 0.8; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; font-weight: 700; flex-shrink: 0; }
.info { display: flex; flex-direction: column; gap: 4px; }
.name { font-size: 18px; font-weight: 600; }
.jobtitle { font-size: 14px; opacity: 0.7; }
.company { font-size: 14px; font-weight: 500; color: ${config.accentColor}; margin-top: 4px; }
.details { display: flex; flex-direction: column; gap: 4px; padding: 0 24px 20px; font-size: 12px; opacity: 0.6; ${isHorizontal ? "" : "align-items: center; text-align: center;"} }
</style>
</head>
<body>
<div class="card">
  ${config.showLogo
      ? `<div class="header">${logoBase64 ? `<img class="header-logo" src="${logoBase64}" alt="${company.name}">` : `<span class="header-text">${company.name}</span>`}</div>`
      : `<div class="accent"></div>`
  }
  <div class="content">
    ${photoBase64
        ? `<img class="avatar" src="${photoBase64}" alt="${fullName}">`
        : `<div class="avatar-placeholder">${person.first_name[0]}${person.last_name[0]}</div>`
    }
    <div class="info">
      <div class="name">${fullName}</div>
      <div class="jobtitle">${person.title}</div>
      <div class="company">${company.name}</div>
    </div>
  </div>
  <div class="details">
    ${config.showEmail && person.email ? `<div>${person.email}</div>` : ""}
    ${config.showPhone && person.phone ? `<div>${person.phone}</div>` : ""}
  </div>
</div>
</body>
</html>`;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ companyId: string }> }
) {
    const { companyId } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: company } = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("id", companyId)
        .single();

    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    const { data: people } = await supabase
        .from(TABLES.PEOPLE)
        .select("*")
        .eq("company_id", companyId);

    if (!people || people.length === 0) {
        return NextResponse.json({ error: "No people found" }, { status: 404 });
    }

    // Get template from the first person's template_id
    const templateId = people[0].template_id;
    const { data: template } = await supabase
        .from(TABLES.TEMPLATES)
        .select("*")
        .eq("id", templateId)
        .single();

    const config: TemplateConfig = template?.config ?? {
        backgroundColor: "#ffffff",
        textColor: "#1a1a1a",
        accentColor: "#3b82f6",
        fontFamily: "sans-serif",
        layout: "horizontal",
        showLogo: true,
        showPhone: true,
        showEmail: true,
        showAddress: true,
    };

    // Get company logo as base64
    const logoBase64 = company.logo_url
        ? await imageToBase64(supabase, STORAGE.LOGOS, company.logo_url)
        : null;

    const zip = new JSZip();

    for (const person of people) {
        const photoBase64 = person.photo_url
            ? await imageToBase64(supabase, STORAGE.PHOTOS, person.photo_url)
            : null;

        const html = renderCardHtml(person, company, config, logoBase64, photoBase64);
        const fileName = `${person.first_name.toLowerCase()}-${person.last_name.toLowerCase()}.html`;
        zip.file(fileName, html);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipBuffer, {
        headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="${company.name.toLowerCase().replace(/\s+/g, "-")}-cards.zip"`,
        },
    });
}
