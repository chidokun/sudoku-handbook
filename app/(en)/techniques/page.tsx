import { TechniquesIndexPage, techniquesIndexMeta } from "@/components/pages/TechniquesIndexPage";

export const metadata = techniquesIndexMeta("en");

export default function Page() {
  return <TechniquesIndexPage lang="en" />;
}
