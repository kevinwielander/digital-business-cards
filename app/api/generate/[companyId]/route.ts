import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TABLES, STORAGE } from "@/lib/supabase/constants";
import JSZip from "jszip";
import QRCode from "qrcode";
import type { TemplateConfig, CardElement, SampleCardData } from "@/lib/types";

async function imageToBase64(
    supabase: Awaited<ReturnType<typeof createClient>>,
    bucket: string,
    path: string
): Promise<string | null> {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error || !data) return null;
    const buffer = Buffer.from(await data.arrayBuffer());
    const ext = path.split(".").pop()?.toLowerCase() ?? "png";
    const mime =
        ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : ext === "svg"
              ? "image/svg+xml"
              : `image/${ext}`;
    return `data:${mime};base64,${buffer.toString("base64")}`;
}

function generateVCard(data: SampleCardData): string {
    return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${data.full_name}`,
        `N:${data.last_name};${data.first_name};;;`,
        data.title ? `TITLE:${data.title}` : "",
        data.company ? `ORG:${data.company}` : "",
        data.email ? `EMAIL:${data.email}` : "",
        data.phone ? `TEL:${data.phone}` : "",
        data.address ? `ADR:;;${data.address};;;;` : "",
        data.website ? `URL:${data.website}` : "",
        "END:VCARD",
    ].filter(Boolean).join("\r\n");
}

async function generateQrDataUrl(vcard: string): Promise<string> {
    return QRCode.toDataURL(vcard, {
        width: 200,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
    });
}

function getDisplayText(el: CardElement, data: SampleCardData): string {
    if (el.boundField === "custom") return el.customText ?? "";
    if (el.boundField?.startsWith("custom:")) {
        const key = el.boundField.slice(7);
        return data.custom_fields?.[key] ?? "";
    }
    if (el.boundField) return data[el.boundField]?.toString() ?? "";
    return "";
}

function getLinkedText(el: CardElement, data: SampleCardData): string {
    const text = getDisplayText(el, data);
    if (!text) return "";

    if (el.boundField === "email") {
        return `<a href="mailto:${text}" style="color:inherit;text-decoration:none;">${text}</a>`;
    }
    if (el.boundField === "phone") {
        return `<a href="tel:${text}" style="color:inherit;text-decoration:none;">${text}</a>`;
    }
    if (el.boundField === "website") {
        const href = text.startsWith("http") ? text : `https://${text}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;">${text}</a>`;
    }
    return text;
}

function renderElementHtml(
    el: CardElement,
    data: SampleCardData,
    logoBase64: string | null,
    photoBase64: string | null,
    qrDataUrl: string | null,
    vcfDataUrl: string,
): string {
    const opacity = el.opacity !== undefined ? `opacity:${el.opacity};` : "";
    const rotation = el.rotation ? `transform:rotate(${el.rotation}deg);` : "";
    const shadow = el.boxShadow ? `box-shadow:${el.boxShadow};` : "";
    const baseStyle = `position:absolute;left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;z-index:${el.zIndex};${opacity}${rotation}${shadow}`;

    if (el.type === "text") {
        const align = el.textAlign ?? "left";
        const justify = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
        const letterSpacing = el.letterSpacing ? `letter-spacing:${el.letterSpacing}px;` : "";
        const lineHeight = el.lineHeight ? `line-height:${el.lineHeight};` : "";
        const textTransform = el.textTransform && el.textTransform !== "none" ? `text-transform:${el.textTransform};` : "";
        const textShadow = el.textShadow ? `text-shadow:${el.textShadow};` : "";
        const style = `${baseStyle}display:flex;align-items:center;justify-content:${justify};font-size:${el.fontSize ?? 14}px;font-family:${el.fontFamily ?? "sans-serif"};font-weight:${el.fontWeight ?? "normal"};color:${el.color ?? "#000"};overflow:hidden;${letterSpacing}${lineHeight}${textTransform}${textShadow}`;
        return `<div style="${style}">${getLinkedText(el, data)}</div>`;
    }

    if (el.type === "image") {
        const src =
            el.imageSource === "logo"
                ? logoBase64
                : el.imageSource === "photo"
                  ? photoBase64
                  : null;
        const radius = el.borderRadius ?? 0;
        const fit = el.objectFit ?? "contain";
        const imgOpacity = el.imageOpacity !== undefined ? `opacity:${el.imageOpacity};` : "";
        if (src) {
            return `<div style="${baseStyle}overflow:hidden;border-radius:${radius}px;"><img src="${src}" style="width:100%;height:100%;object-fit:${fit};border-radius:${radius}px;${imgOpacity}" /></div>`;
        }
        return `<div style="${baseStyle}background:#e4e4e7;border-radius:${radius}px;"></div>`;
    }

    if (el.type === "shape") {
        const bg = el.gradient || el.backgroundColor || "#3b82f6";
        const style = `${baseStyle}background:${bg};border-radius:${el.shapeRadius ?? 0}px;border:${el.border ?? "none"};`;
        return `<div style="${style}"></div>`;
    }

    if (el.type === "qrcode" && qrDataUrl) {
        return `<div style="${baseStyle}"><img src="${qrDataUrl}" style="width:100%;height:100%;object-fit:contain;" /></div>`;
    }

    if (el.type === "save-contact") {
        const style = `${baseStyle}display:flex;align-items:center;gap:4px;cursor:pointer;font-size:${el.fontSize ?? 12}px;font-family:${el.fontFamily ?? "sans-serif"};font-weight:${el.fontWeight ?? "500"};color:${el.color ?? "#3b82f6"};text-decoration:none;`;
        return `<a href="${vcfDataUrl}" download="contact.vcf" style="${style}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      ${el.customText ?? "Save Contact"}</a>`;
    }

    return "";
}

function renderCardHtml(
    person: SampleCardData,
    config: TemplateConfig,
    logoBase64: string | null,
    photoBase64: string | null,
    qrDataUrl: string | null,
    vcfDataUrl: string,
): string {
    const sorted = [...config.elements].sort((a, b) => a.zIndex - b.zIndex);
    const elementsHtml = sorted
        .map((el) => renderElementHtml(el, person, logoBase64, photoBase64, qrDataUrl, vcfDataUrl))
        .join("\n  ");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${person.full_name} - ${person.company}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f4f4f5; }
.card { position: relative; width: ${config.width}px; height: ${config.height}px; background: ${config.backgroundColor}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
</style>
</head>
<body>
<div class="card">
  ${elementsHtml}
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

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: company } = await supabase
        .from(TABLES.COMPANIES)
        .select("*")
        .eq("id", companyId)
        .single();

    if (!company)
        return NextResponse.json({ error: "Company not found" }, { status: 404 });

    const peopleIds = new URL(request.url).searchParams.get("people");
    let query = supabase
        .from(TABLES.PEOPLE)
        .select("*")
        .eq("company_id", companyId);

    if (peopleIds) {
        query = query.in("id", peopleIds.split(","));
    }

    const { data: people } = await query;

    if (!people || people.length === 0) {
        return NextResponse.json({ error: "No people found" }, { status: 404 });
    }

    // Get company logo as base64
    const logoBase64 = company.logo_url
        ? await imageToBase64(supabase, STORAGE.LOGOS, company.logo_url)
        : null;

    const zip = new JSZip();

    for (const person of people) {
        // Get template for this person
        const { data: template } = await supabase
            .from(TABLES.TEMPLATES)
            .select("*")
            .eq("id", person.template_id)
            .single();

        if (!template) continue;

        const config: TemplateConfig = template.config;

        const photoBase64 = person.photo_url
            ? await imageToBase64(supabase, STORAGE.PHOTOS, person.photo_url)
            : null;

        const personData: SampleCardData = {
            first_name: person.first_name,
            last_name: person.last_name,
            full_name: `${person.first_name} ${person.last_name}`,
            title: person.title ?? "",
            email: person.email ?? "",
            phone: person.phone ?? "",
            address: "",
            company: company.name,
            website: company.website ?? "",
            logoUrl: null,
            photoUrl: null,
            custom_fields: person.custom_fields ?? {},
        };

        const baseName = `${person.first_name.toLowerCase()}-${person.last_name.toLowerCase()}`;

        // Generate vCard
        const vcard = generateVCard(personData);
        zip.file(`${baseName}.vcf`, vcard);

        // Embed vCard as data URL for the save-contact button
        const vcfDataUrl = `data:text/vcard;base64,${Buffer.from(vcard).toString("base64")}`;

        // Generate QR code if template uses it
        const hasQr = config.elements.some((el) => el.type === "qrcode");
        const qrDataUrl = hasQr ? await generateQrDataUrl(vcard) : null;

        const html = renderCardHtml(personData, config, logoBase64, photoBase64, qrDataUrl, vcfDataUrl);
        zip.file(`${baseName}.html`, html);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipBuffer, {
        headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="${company.name.toLowerCase().replace(/\s+/g, "-")}-cards.zip"`,
        },
    });
}
