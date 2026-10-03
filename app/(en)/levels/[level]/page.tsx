import { LevelPage, levelMeta } from "@/components/pages/LevelPage";
import { getLevels } from "@/content/levels";

export const dynamicParams = false;
export const generateStaticParams = () => getLevels("en").map((l) => ({ level: l.slug }));

export async function generateMetadata(props: PageProps<"/levels/[level]">) {
  return levelMeta("en", (await props.params).level);
}

export default async function Page(props: PageProps<"/levels/[level]">) {
  return <LevelPage lang="en" slug={(await props.params).level} />;
}
