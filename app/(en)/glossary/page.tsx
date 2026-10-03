import { GlossaryPage, glossaryMeta } from "@/components/pages/GlossaryPage";

export const metadata = glossaryMeta("en");

export default function Page() {
  return <GlossaryPage lang="en" />;
}
