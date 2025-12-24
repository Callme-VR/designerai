export default function Applayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning>
      <body className="w-full h-auto">{children}</body>
    </html>
  );
}
