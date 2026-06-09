import { ReactNode } from "react";
import Layout from "./Layout";
import { LayoutProvider } from "./LayoutContext";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <LayoutProvider>
      <Layout>{children}</Layout>
    </LayoutProvider>
  );
}
