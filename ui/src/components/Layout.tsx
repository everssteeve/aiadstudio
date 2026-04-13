import type { ReactNode } from 'react';
import { Navigation } from './Navigation.tsx';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
