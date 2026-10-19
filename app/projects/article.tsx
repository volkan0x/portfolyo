import type { Project } from "@/.contentlayer/generated";
import Image from "next/image";
import Link from "next/link";
import { Eye, View } from "lucide-react";

type Props = {
	project: Project;
	views: number;
};

export const Article: React.FC<Props> = ({ project, views }) => {	
	return (
		<article className="p-4 md:p-8">
			{project.video ? (
				<video
					controls
					playsInline
					preload="metadata"
					poster={project.image}
					aria-label={`${project.title} video`}
					className="mb-6 aspect-video w-full rounded-md bg-black object-cover"
				>
					<source src={project.video} type="video/webm" />
					Your browser does not support embedded videos.
				</video>
			) : project.image ? (
					<Image
						src={project.image}
						alt={`${project.title} preview`}
						width={1280}
						height={720}
						className="mb-6 h-auto w-full rounded-md object-cover"
					/>
				) : null}
			<Link href={`/projects/${project.slug}`}>
				<div className="flex justify-between gap-2 items-center">
					<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
						{project.date ? (
							<time dateTime={new Date(project.date).toISOString()}>
								{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
									new Date(project.date),
								)}
							</time>
						) : (
							<span>SOON</span>
						)}
					</span>
					<span className="text-zinc-500 text-xs  flex items-center gap-1">
						<Eye className="w-4 h-4" />{" "}
						{Intl.NumberFormat("en-US", { notation: "compact" }).format(views)}
					</span>
				</div>
				<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
					{project.title}
				</h2>
				<p className="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
					{project.description}
				</p>
			</Link>
		</article>
	);
};
