import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";
import { stack } from "../constants/stack";
import { BsCameraVideo, BsCameraVideoFill, BsInstagram, BsTerminal } from "react-icons/bs";
import { Experience } from "../components/experience";
import Iframe from "../components/iframe";
import { Timeline } from "../components/timeline";
import { SiElevenlabs } from "react-icons/si";
import { SiGoogleads } from "react-icons/si";
import { SiGoogleadsense } from "react-icons/si";
import { TbBrandAdobePhotoshop } from "react-icons/tb";
import { RiFirebaseFill, RiMetaLine, RiVercelLine } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";
import { DiNodejs } from "react-icons/di";
import { SiReact } from "react-icons/si";





const hasRedisEnv =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = hasRedisEnv ? Redis.fromEnv() : null;

export const revalidate = 60;
export default async function ProjectsPage() {
  const emptyViews = allProjects.reduce(
    (acc, project) => {
      acc[project.slug] = 0;
      return acc;
    },
    {} as Record<string, number>,
  );
  const views = redis
    ? await redis
        .mget<number[]>(
          ...allProjects.map((p) => ["pageviews", "projects", p.slug].join(":")),
        )
        .then((pageviews) =>
          pageviews.reduce(
            (acc, value, index) => {
              acc[allProjects[index].slug] = value ?? 0;
              return acc;
            },
            {} as Record<string, number>,
          ),
        )
        .catch(() => emptyViews)
    : emptyViews;

  const top3 = allProjects.find((project) => project.slug === "aristo-today")!;
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
        project.slug !== "workflow" &&
        project.slug !== top3.slug &&
        project.slug !== "volkan0x.pro" &&
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

    const feedbird = allProjects.find(
  (project) => project.slug === "feedbird",
)!;

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projects
          </h2>
        </div>
        <div className="w-full h-px bg-zinc-800" />
        <div className="mx-auto w-full">
          <Experience />
        </div>
        <div className="w-full h-px bg-zinc-800" />
        <div className="max-w-2xl mx-auto lg:mx-0">
          
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Products
          </h2>
          <div className="w-full h-px my-8 bg-zinc-800" />
          {/* <p className="mt-4 text-zinc-400">
            Products and tools I am building currently.
          </p> */}
        </div>
        <div className="relative z-50 overflow-hidden grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3 border-t border-gray-900/10 md:grid-cols-3 lg:border-t-0">
          <div className="grid gap-4">
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
                    View source
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
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
            UI & UX
          </h2>
          <div className="w-full h-px my-8 bg-zinc-800" />
          {/* <p className="mt-4 text-zinc-400">
            UI & UX design for digital products.
          </p> */}
        </div>
        <div className=" grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3 border-t border-gray-900/10 md:grid-cols-3 lg:border-t-0 ">
          {[top5].map((project) => (
            <Card key={project.slug}>
              <Article project={project} views={views[project.slug] ?? 0} />
              <div className="flex px-8 gap-x-2 items-center flex text-gray-500 stroke-1">
                  {stack.figma.icon}
              </div>
              <div className="m-8 flex flex-row space-x-2 mt-4 items-center px-0.5">
                  <BsTerminal className="h-4 w-4 stroke-0.5 text-zinc-500 group-hover:text-cyan-500" />
                  <p className="text-zinc-500 group-hover:text-cyan-500 text-xs">
                    View source
                  </p>
                </div>
            </Card>
          ))}
        </div>
        <div className=" grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3 border-t border-gray-900/10 md:grid-cols-3 lg:border-t-0 ">
          {[top8].map((project) => (
            <Card key={project.slug}>
              <Article project={project} views={views[project.slug] ?? 0} />
              <div className="flex px-8 gap-x-2 items-center flex text-gray-500 stroke-1">
                  {stack.nextjs.icon}
                  {stack.react.icon}
                  {stack.typescript.icon}
                  {stack.tailwindcss.icon}
                  {stack.javascript.icon}
              </div>
              <div className="m-8 flex flex-row space-x-2 mt-4 items-center px-0.5">
                  <BsTerminal className="h-4 w-4 stroke-0.5 text-zinc-500 group-hover:text-cyan-500" />
                  <p className="text-zinc-500 group-hover:text-cyan-500 text-xs">
                    View source
                  </p>
              </div>
            </Card>
          ))}
        </div>
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Design
          </h2>
        <div className="w-full h-px my-8 bg-zinc-800" />
          {/* <p className="mt-4 text-zinc-400">
            Instagram, YouTube, Facebook and TikTok promotional videos.
          </p> */}
        </div>
        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                  {project.slug === "feedbird" && (
                    <div className="flex items-center gap-x-2 px-8 text-gray-500 stroke-1">
                      <SiElevenlabs />
                      {stack.adobeAftereffect.icon}
                    </div>
                  )}
                  {project.slug === "growtechie" && (
                      <div className="flex items-center gap-x-2 px-8 text-gray-500 stroke-1">
                        <RiFirebaseFill />
                        <RiVercelLine />
                        {stack.typescript.icon}
                      </div>
                    )}
                   <div className="m-8 flex flex-row space-x-2 mt-4 items-center px-0.5">
                  <BsCameraVideo className="h-4 w-4 stroke-0.5 text-zinc-500 group-hover:text-cyan-500" />
                  <p className="text-zinc-500 group-hover:text-cyan-500 text-xs">
                    View
                  </p>
              </div>
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                   {project.slug === "feen" && (
                    <div className="flex items-center gap-x-2 px-8 text-gray-500 stroke-1">
                      <SiGoogleadsense />
                      {stack.adobeAftereffect.icon}
                      <RiMetaLine size={24} />
                    </div>
                  )}
                   
                    {project.slug === "gallerima" && (
                      <div className="flex items-center gap-x-2 px-8 text-gray-500 stroke-1">
                        {stack.adobeAftereffect.icon}
                        {stack.notion.icon}
                      </div>
                    )}
                </Card>
              ))}

           
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                  {project.slug === "iati" && (
                    <div className="flex items-center gap-x-2 px-8 text-gray-500 stroke-1">
                      {stack.notion.icon}
                      {stack.figma.icon}
                      <FaGoogle />
                    </div>
                  )} 
                  
                    {project.slug === "the-kreatif" && (
                    <div className="flex items-center gap-x-2 px-8 text-gray-500 stroke-1">
                      <SiReact size={22}/>
                      {stack.figma.icon}
                      {stack.adobeAftereffect.icon}
                    </div>
                  )}
                </Card>
              ))}
          </div>
        </div>
      </div>
      <div className="py-16 gap-4">
          <h2 className="text-3xl py-8 text-zinc-100 font-bold tracking-tight sm:text-4xl">
            Figma design timeline
          </h2>
          <Timeline />
          {/* <div>
            <Iframe />
          </div> */}
        </div>
    </div>
  );
}
