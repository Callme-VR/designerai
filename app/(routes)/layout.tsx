
export default function Applayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en"  suppressContentEditableWarning>
            <body
            >
                {children}
            </body>
        </html>
    );
}
    