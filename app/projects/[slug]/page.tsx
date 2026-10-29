import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { Redis } from "@upstash/redis";
import { Metadata } from "next";
import { sentenceCase } from "@/util/sentenceCase";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = allProjects.find(
    (project) => project.slug === params.slug && project.published,
  );

  if (!project) {
    return {};
  }

  return {
    title: sentenceCase(project.title),
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

const hasRedisEnv =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = hasRedisEnv ? Redis.fromEnv() : null;

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allProjects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  const views = redis
    ? await redis
        .get<number>(["pageviews", "projects", slug].join(":"))
        .then((count) => count ?? 0)
        .catch(() => 0)
    : 0;

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header project={project} views={views} />
      <ReportView slug={project.slug} />

      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        <Mdx code={project.body.code} />
      </article>
    </div>
  );
}
