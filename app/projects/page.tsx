import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";
import { stack } from "../constants/stack";
import { BsTerminal } from "react-icons/bs";
import { Experience } from "../components/experience";
import Iframe from "../components/iframe";
import { Timeline } from "../components/timeline";

const hasRedisEnv =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = hasRedisEnv ? Redis.fromEnv() : null;

export const revalidate = 60;
export default async function ProjectsPage() {
  const views = redis
    ? (
        await redis.mget<number[]>(
          ...allProjects.map((p) => ["pageviews", "projects", p.slug].join(":")),
        )
      ).reduce(
        (acc, v, i) => {
          acc[allProjects[i].slug] = v ?? 0;
          return acc;
        },
        {} as Record<string, number>,
      )
    : allProjects.reduce(
        (acc, project) => {
          acc[project.slug] = 0;
          return acc;
        },
        {} as Record<string, number>,
      );

  const featured = allProjects.find((project) => project.slug === "workflow")!;
  const top3 = allProjects.find((project) => project.slug === "havadurumu15")!;
  const top4 = allProjects.find((project) => project.slug === "volfcan.com")!;
  const top5 = allProjects.find((project) => project.slug === "flora-garden")!;
  const top6 = allProjects.find(
    (project) => project.slug === "image-classifier",
  )!;
  const top7 = allProjects.find((project) => project.slug === "price-scraper")!;
  const top8 = allProjects.find((project) => project.slug === "twitch-clone")!;
  const sorted = allProjects
    .filter((p) => p.published)
    .filter(
      (project) =>
        project.slug !== featured.slug &&
        project.slug !== top3.slug &&
        project.slug !== top4.slug &&
        project.slug !== top5.slug &&
        project.slug !== top6.slug &&
        project.slug !== top7.slug &&
        project.slug !== top8.slug,
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            projects
          </h2>
        </div>
        <div className="w-full h-px bg-zinc-800" />
        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
          <Card>
            <Link href={`/projects/${featured.slug}`}>
              <article className="relative w-full h-full p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-zinc-100">
                    {featured.date ? (
                      <time dateTime={new Date(featured.date).toISOString()}>
                        {Intl.DateTimeFormat(undefined, {
                          dateStyle: "medium",
                        }).format(new Date(featured.date))}
                      </time>
                    ) : (
                      <span>SOON</span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <Eye className="w-4 h-4" />{" "}
                    {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                      views[featured.slug] ?? 0,
                    )}
                  </span>
                </div>
                <h2
                  id="featured-post"
                  className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                >
                  {featured.title}
                </h2>
                <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                  {featured.description}
                </p>
                <div className="absolute bottom-4 md:bottom-8">
                  {/* <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </p> */}
                </div>
              </article>
            </Link>
          </Card>
          <Experience />
        </div>
        <div className="w-full h-px bg-zinc-800" />
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            products
          </h2>
          <p className="mt-4 text-zinc-400">
            products and tools i am building currently
          </p>
        </div>
        <div className="relative z-50 overflow-hidden grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3 border-t border-gray-900/10 md:grid-cols-3 lg:border-t-0">
          <div className="grid gap-4">
            {[top3, top4].map((project) => (
              <Card key={project.slug}>
                <Article project={project} views={views[project.slug] ?? 0} />
                <div className="px-8 gap-x-2 items-center flex stroke-1  text-gray-500">
                  {stack.nextjs.icon}
                  {stack.react.icon}
                  {stack.tailwindcss.icon}
                  {stack.typescript.icon}
                </div>
                <div className="m-8 flex flex-row space-x-2 mt-4 items-center px-0.5">
                  <BsTerminal className="h-4 w-4 stroke-0.5 text-zinc-500 group-hover:text-cyan-500" />
                  <p className="text-zinc-500 group-hover:text-cyan-500 text-xs">
                    View Source
                  </p>
                </div>
              </Card>
            ))}
            {[top7, top6].map((project) => (
              <Card key={project.slug}>
                <Article project={project} views={views[project.slug] ?? 0} />
                <div className="flex px-8 gap-x-2 items-center flex text-gray-500 stroke-1">
                  {stack.python.icon}
                  {stack.flask.icon}
                </div>
                <div className="m-8 flex flex-row space-x-2 mt-4 items-center px-0.5">
                  <BsTerminal className="h-4 w-4 stroke-0.5 text-zinc-500 group-hover:text-cyan-500" />
                  <p className="text-zinc-500 group-hover:text-cyan-500 text-xs">
                    View Source
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-zinc-800" />
        {/* <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            digital marketing
          </h2>
          <p className="mt-4 text-zinc-400">
            seo, ui & ux design and google ads services
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3 border-t border-gray-900/10 md:grid-cols-3 lg:border-t-0 ">
            {[top2].map((project) => (
              <Card key={project.slug}>
                <Article project={project} views={views[project.slug] ?? 0} />
              </Card>
            ))}
          </div> */}
        {/* <div className="w-full h-px bg-zinc-800" /> */}
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            ui & ux
          </h2>
          <p className="mt-4 text-zinc-400">
            ui & ux design for digital products
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3 border-t border-gray-900/10 md:grid-cols-3 lg:border-t-0 ">
          {[top5, top8].map((project) => (
            <Card key={project.slug}>
              <Article project={project} views={views[project.slug] ?? 0} />
            </Card>
          ))}
        </div>
        <div className="py-16 gap-4">
          <h2 className="text-3xl py-8 text-zinc-100 font-bold tracking-tight sm:text-4xl">
            figma design timeline
          </h2>
          <Timeline />
          {/* <div>
            <Iframe />
          </div> */}
        </div>
        <div className="w-full h-px bg-zinc-800" />
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            digital marketing & design
          </h2>
          <p className="mt-4 text-zinc-400">
            instagram, youtube, facebook and tiktok promotional videos
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
