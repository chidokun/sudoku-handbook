import { TechniquePage, techniqueMeta } from "@/components/pages/TechniquePage";
import { TECH_SLUGS } from "@/content/techniques";

export const dynamicParams = false;
export const generateStaticParams = () => TECH_SLUGS.map((slug) => ({ slug }));

export async function generateMetadata(props: PageProps<"/vi/techniques/[slug]">) {
  return techniqueMeta("vi", (await props.params).slug);
}

export default async function Page(props: PageProps<"/vi/techniques/[slug]">) {
  return <TechniquePage lang="vi" slug={(await props.params).slug} />;
}
