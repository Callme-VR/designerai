import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Design.ai Home"
      className="flex flex-1 items-center gap-1 text-2xl font-semibold"
    >
      <span className="font-extrabold text-primary inline-block">Xsigner</span>
      <span className="font-semibold text-primary">AI</span>
    </Link>
  );
}
