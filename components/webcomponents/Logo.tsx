import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex flex-1 items-center gap-2 text-2xl">
            <span className="inline-block font-bold text-primary">Larva</span>
            <span className="inline-block font-bold">Design.ai</span>
        </Link>
    )
}