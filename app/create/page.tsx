"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TABLES, STORAGE } from "@/lib/supabase/constants"; // used for save-to-account
import { useTranslation } from "../components/I18nProvider";
import { useToast } from "../components/ToastProvider";
import { SAMPLE_TEMPLATES } from "@/lib/sample-templates";
import CardPreviewRenderer from "../components/designer/CardPreviewRenderer";
import TemplateDesigner from "../components/TemplateDesigner";
import TemplateCard from "../components/TemplateCard";
import ImageUpload from "../components/ImageUpload";
import type { TemplateConfig, SampleCardData } from "@/lib/types";
import Link from "next/link";

interface DbTemplate {
    id: string;
    name: string;
    config: TemplateConfig;
    is_sample?: boolean;
}

export default function CreatePage() {
    const { t } = useTranslation();
    const { toast } = useToast();

    // Step management
    const [step, setStep] = useState<"template" | "info" | "done">("template");

    // Template selection
    const [templates, setTemplates] = useState<DbTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);
    const [selectedTemplateName, setSelectedTemplateName] = useState("");

    // User info
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [company, setCompany] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // Download state
    const [generating, setGenerating] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    // Use code-defined templates — always up to date
    useEffect(() => {
        setTemplates(SAMPLE_TEMPLATES.map((t, i) => ({
            id: `local-${i}`,
            name: t.name,
            config: t.config,
            is_sample: true,
        })));
    }, []);

    // Photo preview
    useEffect(() => {
        if (photo) {
            const url = URL.createObjectURL(photo);
            setPhotoPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [photo]);

    // Logo preview
    useEffect(() => {
        if (logo) {
            const url = URL.createObjectURL(logo);
            setLogoPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [logo]);

    const previewData: SampleCardData = {
        first_name: firstName || "Your",
        last_name: lastName || "Name",
        full_name: `${firstName || "Your"} ${lastName || "Name"}`,
        title: title || "Job Title",
        email: email || "email@example.com",
        phone: phone || "+1 555 000 0000",
        address: "",
        company: company || "Company",
        website: website || "example.com",
        logoUrl: logoPreview,
        photoUrl: photoPreview,
    };

    function selectTemplate(tmpl: DbTemplate) {
        // Reset low-opacity images to fully visible for quick create
        const config = {
            ...tmpl.config,
            elements: tmpl.config.elements.map((el) => {
                if (el.type === "image" && el.imageOpacity !== undefined && el.imageOpacity < 1) {
                    return { ...el, imageOpacity: 1 };
                }
                return el;
            }),
        };
        setSelectedTemplate(config);
        setSelectedTemplateName(tmpl.name);
        setStep("info");
    }

    const [showDesigner, setShowDesigner] = useState(false);

    function handleOpenDesigner() {
        if (!selectedTemplate) return;
        setShowDesigner(true);
    }

    function handleDesignerSave(updatedConfig: TemplateConfig) {
        setSelectedTemplate(updatedConfig);
        setShowDesigner(false);
        toast("Template updated");
    }

    async function handleGenerate() {
        if (!selectedTemplate) return;
        setGenerating(true);

        // Import dependencies dynamically for client-side generation
        const QRCode = (await import("qrcode")).default;

        const vcard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${firstName} ${lastName}`,
            `N:${lastName};${firstName};;;`,
            title ? `TITLE:${title}` : "",
            company ? `ORG:${company}` : "",
            email ? `EMAIL:${email}` : "",
            phone ? `TEL:${phone}` : "",
            website ? `URL:${website}` : "",
            "END:VCARD",
        ].filter(Boolean).join("\r\n");

        const vcfDataUrl = `data:text/vcard;base64,${btoa(vcard)}`;

        // Generate QR if template uses it
        const hasQr = selectedTemplate.elements.some((el) => el.type === "qrcode");
        let qrDataUrl: string | null = null;
        if (hasQr) {
            qrDataUrl = await QRCode.toDataURL(vcard, { width: 200, margin: 1 });
        }

        // Convert photo and logo to base64 if present
        async function fileToBase64(file: File): Promise<string> {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        }

        const photoBase64 = photo ? await fileToBase64(photo) : null;
        const logoBase64 = logo ? await fileToBase64(logo) : null;

        // Render HTML
        const sorted = [...selectedTemplate.elements].sort((a, b) => a.zIndex - b.zIndex);

        // Get Google Fonts URL
        const { getGoogleFontsUrl, getUsedFonts } = await import("@/lib/fonts");
        const fontsUrl = getGoogleFontsUrl(getUsedFonts(selectedTemplate.elements));

        const elementsHtml = sorted.map((el) => {
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
                const style = `${baseStyle}display:flex;align-items:center;justify-content:${justify};font-size:${el.fontSize ?? 14}px;font-family:${el.fontFamily ?? "sans-serif"};font-weight:${el.fontWeight ?? "normal"};color:${el.color ?? "#000"};overflow:hidden;white-space:nowrap;text-overflow:ellipsis;${letterSpacing}${lineHeight}${textTransform}${textShadow}`;

                let text = "";
                if (el.boundField === "custom") text = el.customText ?? "";
                else if (el.boundField) text = (previewData as unknown as Record<string, string>)[el.boundField] ?? "";

                // Make email/phone/website clickable
                if (el.boundField === "email" && text) text = `<a href="mailto:${text}" style="color:inherit;text-decoration:none;">${text}</a>`;
                if (el.boundField === "phone" && text) text = `<a href="tel:${text}" style="color:inherit;text-decoration:none;">${text}</a>`;
                if (el.boundField === "website" && text) {
                    const href = text.startsWith("http") ? text : `https://${text}`;
                    text = `<a href="${href}" target="_blank" style="color:inherit;text-decoration:none;">${text}</a>`;
                }

                return `<div style="${style}">${text}</div>`;
            }

            if (el.type === "image") {
                const isDataUri = el.imageSource?.startsWith("asset:data:");
                const src =
                    el.imageSource === "photo" ? photoBase64 :
                    isDataUri ? el.imageSource!.slice(6) :
                    logoBase64;
                const radius = el.borderRadius ?? 0;
                const fit = el.objectFit ?? "contain";
                const imgOpacity = el.imageOpacity !== undefined ? `opacity:${el.imageOpacity};` : "";
                if (src) {
                    const img = `<img src="${src}" style="width:100%;height:100%;object-fit:${fit};border-radius:${radius}px;${imgOpacity}" />`;
                    if (el.linkUrl) return `<a href="${el.linkUrl}" target="_blank" rel="noopener noreferrer" style="${baseStyle}overflow:hidden;border-radius:${radius}px;display:block;">${img}</a>`;
                    return `<div style="${baseStyle}overflow:hidden;border-radius:${radius}px;">${img}</div>`;
                }
                return "";
            }

            if (el.type === "shape") {
                const bg = el.gradient || el.backgroundColor || "#3b82f6";
                return `<div style="${baseStyle}background:${bg};border-radius:${el.shapeRadius ?? 0}px;border:${el.border ?? "none"};"></div>`;
            }

            if (el.type === "qrcode" && qrDataUrl) {
                return `<div style="${baseStyle}"><img src="${qrDataUrl}" style="width:100%;height:100%;object-fit:contain;" /></div>`;
            }

            if (el.type === "save-contact") {
                const scStyle = `${baseStyle}display:flex;align-items:center;gap:4px;cursor:pointer;font-size:${el.fontSize ?? 12}px;font-family:${el.fontFamily ?? "sans-serif"};font-weight:${el.fontWeight ?? "500"};color:${el.color ?? "#3b82f6"};text-decoration:none;`;
                return `<a href="${vcfDataUrl}" download="contact.vcf" style="${scStyle}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>${el.customText ?? "Save Contact"}</a>`;
            }

            return "";
        }).join("\n");

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${firstName} ${lastName} - Business Card</title>
${fontsUrl ? `<link rel="stylesheet" href="${fontsUrl}">` : ""}
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: ${selectedTemplate?.pageBackgroundColor ?? "#f4f4f5"}; padding: 20px; }
.card { position: relative; width: ${selectedTemplate.width}px; height: ${selectedTemplate.height}px; background: ${selectedTemplate.backgroundColor}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); max-width: 100%; }
@media (max-width: ${selectedTemplate.width + 40}px) {
  .card { transform: scale(calc((100vw - 40px) / ${selectedTemplate.width})); transform-origin: center center; }
}
</style>
</head>
<body>
<div class="card">
${elementsHtml}
</div>
</body>
</html>`;

        // Create downloadable file
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setStep("done");
        setGenerating(false);
    }

    // Also offer saving for signed-in users
    async function handleSaveToAccount() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast("Sign in to save your card", "info");
            return;
        }

        // Find or create "Personal" company
        let { data: personalCompany } = await supabase
            .from(TABLES.COMPANIES)
            .select("id")
            .eq("user_id", user.id)
            .eq("name", "Personal")
            .single();

        if (!personalCompany) {
            const { data } = await supabase
                .from(TABLES.COMPANIES)
                .insert({ user_id: user.id, name: "Personal", domain: "", website: website || "" })
                .select("id")
                .single();
            personalCompany = data;
        }
        if (!personalCompany) return;

        // Save template
        const { data: savedTemplate } = await supabase
            .from(TABLES.TEMPLATES)
            .insert({ user_id: user.id, name: selectedTemplateName || "My Card Template", config: selectedTemplate })
            .select("id")
            .single();

        if (!savedTemplate) return;

        // Upload photo if present
        let photoPath: string | null = null;
        if (photo) {
            const ext = photo.name.split(".").pop();
            const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;
            await supabase.storage.from(STORAGE.PHOTOS).upload(filePath, photo);
            photoPath = filePath;
        }

        // Create person
        await supabase.from(TABLES.PEOPLE).insert({
            company_id: personalCompany.id,
            template_id: savedTemplate.id,
            first_name: firstName,
            last_name: lastName,
            title,
            email,
            phone,
            photo_url: photoPath,
        });

        toast("Card saved to your account!");
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
            {/* Progress */}
            <div className="mb-8 flex items-center gap-3">
                <StepIndicator active={step === "template"} done={step !== "template"} label="1. Template" onClick={() => setStep("template")} />
                <div className="h-px flex-1 bg-zinc-200" />
                <StepIndicator active={step === "info"} done={step === "done"} label="2. Your Info" onClick={selectedTemplate ? () => setStep("info") : undefined} />
                <div className="h-px flex-1 bg-zinc-200" />
                <StepIndicator active={step === "done"} done={false} label="3. Download" />
            </div>

            {/* Step 1: Template Selection */}
            {step === "template" && (
                <div>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight">Create Your Card</h1>
                    <p className="mb-8 text-zinc-500">Pick a template to get started. You can customize it later.</p>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {templates.map((tmpl) => (
                            <TemplateCard
                                key={tmpl.id}
                                name={tmpl.name}
                                config={tmpl.config}
                                onClick={() => selectTemplate(tmpl)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Your Info + Live Preview */}
            {step === "info" && selectedTemplate && (
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Your Information</h1>
                            <p className="mt-1 text-sm text-zinc-500">Fill in your details — the preview updates live.</p>
                        </div>
                        <button
                            onClick={() => setStep("template")}
                            className="text-sm text-zinc-500 hover:text-zinc-800"
                        >
                            Change template
                        </button>
                    </div>

                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Form */}
                        <div className="w-full space-y-4 lg:w-1/2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-700">{t.form_first_name}</label>
                                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-700">{t.form_last_name}</label>
                                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">{t.form_job_title}</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Software Engineer" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">Company</label>
                                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500" />
                            </div>

                            <ImageUpload
                                label={t.form_logo}
                                onImageReady={(file) => setLogo(file)}
                                allowSkipCrop
                            />

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">{t.form_email}</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">{t.form_phone}</label>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">{t.form_website}</label>
                                <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="example.com" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500" />
                            </div>

                            <ImageUpload
                                label={t.form_photo}
                                onImageReady={(file) => setPhoto(file)}
                                aspectRatio={1}
                                shape="round"
                            />

                            <button
                                onClick={handleGenerate}
                                disabled={generating || (!firstName && !lastName)}
                                className="w-full rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50"
                            >
                                {generating ? "Generating..." : "Generate My Card"}
                            </button>

                            <button
                                onClick={handleOpenDesigner}
                                className="w-full rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                                Customize in Designer
                            </button>
                        </div>

                        {/* Live Preview */}
                        <div className="flex w-full flex-col items-center lg:w-1/2">
                            <p className="mb-3 text-sm font-medium text-zinc-400">Live Preview</p>
                            <div className="rounded-xl bg-zinc-100 p-6">
                                <CardPreviewRenderer
                                    config={selectedTemplate}
                                    data={previewData}
                                    scale={0.9}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Done */}
            {step === "done" && (
                <div className="flex flex-col items-center py-10 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                        <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="mb-2 text-2xl font-bold">Your Card is Ready!</h1>
                    <p className="mb-8 max-w-md text-zinc-500">
                        Download your business card as an HTML file. Open it in any browser, share it, or upload it to your website.
                    </p>

                    {/* Preview */}
                    {selectedTemplate && (
                        <div className="mb-8 rounded-xl bg-zinc-100 p-6">
                            <CardPreviewRenderer
                                config={selectedTemplate}
                                data={previewData}
                                scale={0.9}
                            />
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                download={`${firstName.toLowerCase()}-${lastName.toLowerCase()}-card.html`}
                                className="rounded-xl bg-zinc-900 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-zinc-700"
                            >
                                Download Card
                            </a>
                        )}
                        <button
                            onClick={handleSaveToAccount}
                            className="rounded-xl border border-zinc-300 px-8 py-3 text-sm font-semibold text-zinc-700 hover:bg-white hover:shadow-sm"
                        >
                            Save to Account
                        </button>
                    </div>

                    <div className="mt-8 flex gap-4 text-sm">
                        <button
                            onClick={() => setStep("info")}
                            className="text-zinc-500 hover:text-zinc-800"
                        >
                            Edit info
                        </button>
                        <button
                            onClick={() => setStep("template")}
                            className="text-zinc-500 hover:text-zinc-800"
                        >
                            Try another template
                        </button>
                        <Link href="/" className="text-sky-600 hover:underline">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            )}
            {/* Designer Overlay */}
            {showDesigner && selectedTemplate && (
                <TemplateDesigner
                    initialConfig={selectedTemplate}
                    overlay
                    overlayPreviewData={previewData}
                    onOverlaySave={handleDesignerSave}
                    onOverlayCancel={() => setShowDesigner(false)}
                />
            )}
        </div>
    );
}

function StepIndicator({ active, done, label, onClick }: { active: boolean; done: boolean; label: string; onClick?: () => void }) {
    const clickable = !active && (done || onClick);
    return (
        <button
            onClick={onClick}
            disabled={!clickable}
            className={`text-sm font-medium transition ${
                active ? "text-zinc-900" :
                done ? "text-green-600 hover:text-green-700 cursor-pointer" :
                "text-zinc-400"
            } ${clickable ? "hover:underline" : ""}`}
        >
            {done && <span className="mr-1">✓</span>}
            {label}
        </button>
    );
}
