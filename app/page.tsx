import AddCompanyButton from "./components/AddCompanyButton";

export default function Home() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">
                No companies yet
            </h1>
            <p className="text-zinc-500">
                Get started by adding your first company.
            </p>
            <AddCompanyButton />
        </div>
    );
}
