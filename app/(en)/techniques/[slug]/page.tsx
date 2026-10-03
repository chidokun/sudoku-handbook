import { TechniquePage, techniqueMeta } from "@/components/pages/TechniquePage";
import { TECH_SLUGS } from "@/content/techniques";

export const dynamicParams = false;
export const generateStaticParams = () => TECH_SLUGS.map((slug) => ({ slug }));

export async function generateMetadata(props: PageProps<"/techniques/[slug]">) {
  return techniqueMeta("en", (await props.params).slug);
}

export default async function Page(props: PageProps<"/techniques/[slug]">) {
  return <TechniquePage lang="en" slug={(await props.params).slug} />;
}
