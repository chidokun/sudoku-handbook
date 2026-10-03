import { LevelPage, levelMeta } from "@/components/pages/LevelPage";
import { getLevels } from "@/content/levels";

export const dynamicParams = false;
export const generateStaticParams = () => getLevels("vi").map((l) => ({ level: l.slug }));

export async function generateMetadata(props: PageProps<"/vi/levels/[level]">) {
  return levelMeta("vi", (await props.params).level);
}

export default async function Page(props: PageProps<"/vi/levels/[level]">) {
  return <LevelPage lang="vi" slug={(await props.params).level} />;
}
