// @ts-nocheck
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useMDXComponent } from "next-contentlayer/hooks";
import { sentenceCase, sentenceCaseText } from "@/util/sentenceCase";

function clsx(...args: any) {
	return args.filter(Boolean).join(" ");
}

function sentenceCaseChildren(children: React.ReactNode): React.ReactNode {
	const state = { capitalizeNext: true };
	const transform = (node: React.ReactNode): React.ReactNode => {
		if (typeof node === "string") return sentenceCaseText(node, state);
		if (!React.isValidElement(node)) return node;
		if (node.type === "code" || node.type === "pre") return node;

		return React.cloneElement(
			node as React.ReactElement<{ children?: React.ReactNode }>,
			undefined,
			React.Children.map(node.props.children, transform),
		);
	};

	return React.Children.map(children, transform);
}

const components = {
	h1: ({ className, children, ...props }) => (
		<h1
			className={clsx(
				"mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
				className,
			)}
			{...props}
		>
			{sentenceCaseChildren(children)}
		</h1>
	),
	h2: ({ className, children, ...props }) => (
		<h2
			className={clsx(
				"mt-10 scroll-m-20 border-b border-b-zinc-800 pb-1 text-3xl font-semibold tracking-tight first:mt-0",
				className,
			)}
			{...props}
		>
			{sentenceCaseChildren(children)}
		</h2>
	),
	h3: ({ className, children, ...props }) => (
		<h3
			className={clsx(
				"mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
				className,
			)}
			{...props}
		>
			{sentenceCaseChildren(children)}
		</h3>
	),
	h4: ({ className, children, ...props }) => (
		<h4
			className={clsx(
				"mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
				className,
			)}
			{...props}
		>
			{sentenceCaseChildren(children)}
		</h4>
	),
	h5: ({ className, children, ...props }) => (
		<h5
			className={clsx(
				"mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
				className,
			)}
			{...props}
		>
			{sentenceCaseChildren(children)}
		</h5>
	),
	h6: ({ className, children, ...props }) => (
		<h6
			className={clsx(
				"mt-8 scroll-m-20 text-base font-semibold tracking-tight",
				className,
			)}
			{...props}
		>
			{sentenceCaseChildren(children)}
		</h6>
	),
	a: ({ className, ...props }) => (
		<Link
			className={clsx(
				"font-medium text-zinc-900 underline underline-offset-4",
				className,
			)}
			{...props}
		/>
	),
	p: ({ className, children, ...props }) => (
		<p
			className={clsx("leading-7 [&:not(:first-child)]:mt-6", className)}
			{...props}
		>
			{sentenceCaseChildren(children)}
		</p>
	),
	ul: ({ className, children, ...props }) => (
		<ul className={clsx("my-6 ml-6 list-disc", className)} {...props}>
			{children}
		</ul>
	),
	ol: ({ className, children, ...props }) => (
		<ol className={clsx("my-6 ml-6 list-decimal", className)} {...props}>
			{children}
		</ol>
	),
	li: ({ className, children, ...props }) => (
		<li className={clsx("mt-2", className)} {...props}>
			{sentenceCaseChildren(children)}
		</li>
	),
	blockquote: ({ className, children, ...props }) => (
		<blockquote
			className={clsx(
				"mt-6 border-l-2 border-zinc-300 pl-6 italic text-zinc-800 [&>*]:text-zinc-600",
				className,
			)}
			{...props}
		>
			{sentenceCaseChildren(children)}
		</blockquote>
	),
	img: ({
		className,
		alt,
		...props
	}: React.ImgHTMLAttributes<HTMLImageElement>) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			className={clsx("rounded-md border border-zinc-200", className)}
			alt={sentenceCase(alt ?? "")}
			{...props}
		/>
	),
	hr: ({ ...props }) => (
		<hr className="my-4 border-zinc-200 md:my-8" {...props} />
	),
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className="w-full my-6 overflow-y-auto">
			<table className={clsx("w-full", className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr
			className={clsx(
				"m-0 border-t border-zinc-300 p-0 even:bg-zinc-100",
				className,
			)}
			{...props}
		/>
	),
	th: ({ className, children, ...props }) => (
		<th
			className={clsx(
				"border border-zinc-200 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		>
			{sentenceCaseChildren(children)}
		</th>
	),
	td: ({ className, children, ...props }) => (
		<td
			className={clsx(
				"border border-zinc-200 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		>
			{sentenceCaseChildren(children)}
		</td>
	),
	pre: ({ className, ...props }) => (
		<pre
			className={clsx(
				"mt-6 mb-4 overflow-x-auto rounded-lg bg-zinc-900 py-4",
				className,
			)}
			{...props}
		/>
	),
	code: ({ className, ...props }) => (
		<code
			className={clsx(
				"relative rounded border bg-zinc-300 bg-opacity-25 py-[0.2rem] px-[0.3rem] font-mono text-sm text-zinc-600",
				className,
			)}
			{...props}
		/>
	),
	Image,
};

interface MdxProps {
	code: string;
}

export function Mdx({ code }: MdxProps) {
	const Component = useMDXComponent(code);

	return (
		<div className="mdx">
			<Component components={components} />
		</div>
	);
}
