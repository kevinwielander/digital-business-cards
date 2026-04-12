import TemplateDesigner from "@/app/components/TemplateDesigner";

export default function NewTemplatePage() {
    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
            <h1 className="mb-8 text-2xl font-semibold">Create Template</h1>
            <TemplateDesigner />
        </div>
    );
}
