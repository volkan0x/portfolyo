import type { Project } from "@/.contentlayer/generated";
import Link from "next/link";
import { sentenceCase } from "@/util/sentenceCase";

type Props = {
	project: Project;
	views: number;
};

export const Article: React.FC<Props> = ({ project, views }) => {	
	return (
		<article className="p-4 md:p-8">
			<Link href={`/projects/${project.slug}`}>
				<div className="flex justify-end gap-2 items-center">
					<span className="text-zinc-500 text-xs">
						{Intl.NumberFormat("en-US", { notation: "compact" }).format(views)}
						{" Views"}
					</span>
				</div>
				<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
					{sentenceCase(project.title)}
				</h2>
				<p className="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
					{sentenceCase(project.description)}
				</p>
			</Link>
		</article>
	);
};
