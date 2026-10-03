import { RootShell, rootMetadata } from "@/components/RootShell";
import "../globals.css";

export { viewport } from "@/components/RootShell";
export const metadata = rootMetadata("en");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
