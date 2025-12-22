import Link from "next/link"

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Design.ai Home"
      className="flex items-center gap-1 text-xl font-semibold"
    >
      <span className="text-primary">X</span>
      <span>design.ai</span>
    </Link>
  )
}
