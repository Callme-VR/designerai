import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Larva Design.ai Home"
      className="flex items-center gap-2 text-2xl font-bold"
    >
      <span className="text-primary">Larva</span>
      <span>Design.ai</span>
    </Link>
  )
}
