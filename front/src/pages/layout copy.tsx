import * as React from 'react';

export const metadata = {
  title: 'Sthereum',
  description: 'STO demonstration open source project',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}