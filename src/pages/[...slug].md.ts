// Every docs page as raw Markdown at <path>.md: the title and description
// first, then the body as written. Agents read this, not the HTML.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
	const docs = await getCollection('docs');
	return docs.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
};

export const GET: APIRoute = ({ props }) => {
	const { entry } = props as { entry: { data: { title: string; description?: string }; body?: string } };
	const head = `# ${entry.data.title}\n\n${entry.data.description ? entry.data.description + '\n\n' : ''}`;
	return new Response(head + (entry.body ?? ''), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
