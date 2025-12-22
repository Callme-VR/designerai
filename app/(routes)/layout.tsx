
export default function Applayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
            >
                {children}
            </body>
        </html>
    );
}
    