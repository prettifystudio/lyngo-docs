// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';

export default defineConfig({
	site: 'https://docs.lyngo.app',
	integrations: [
		starlight({
			title: 'Lyngo',
			description: 'Localization for your repository, from the terminal. Your agent builds the feature; Lyngo localizes it.',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/prettifystudio' }],
			customCss: ['./src/styles/custom.css'],
			logo: { src: './src/assets/logo.svg', alt: 'Lyngo' },
			expressiveCode: { themes: ['github-dark-default'], styleOverrides: { borderRadius: '12px', frames: { shadowColor: 'transparent' } } },
			components: { PageTitle: './src/components/PageTitle.astro' },
			plugins: [
				starlightLlmsTxt({
					projectName: 'Lyngo',
					description: 'Localization for your repository, from the terminal. The CLI wraps every string a person reads, reuses the keys the project has, translates and verifies the catalogs. The GitHub App opens a pull request for anything pushed without it.',
					details: 'Every page is also served as Markdown: add .md to its path. llms-full.txt holds the whole manual.',
				}),
			],
			sidebar: [
				{ label: 'Get started', slug: 'get-started' },
				{ label: 'How it works', slug: 'how-it-works' },
				{
					label: 'Commands',
					items: [
						{ label: 'lyngo login', slug: 'commands/login' },
						{ label: 'lyngo init', slug: 'commands/init' },
						{ label: 'lyngo localize', slug: 'commands/localize' },
						{ label: 'lyngo translate', slug: 'commands/translate' },
						{ label: 'lyngo check and status', slug: 'commands/check-status' },
					],
				},
				{
					label: 'Agents',
					items: [
						{ label: 'Claude Code', slug: 'agents/claude-code' },
						{ label: 'Other MCP clients', slug: 'agents/mcp' },
						{ label: 'Without an agent', slug: 'agents/none' },
					],
				},
				{
					label: 'Frameworks',
					items: [
						{ label: 'Laravel: Blade, Livewire, PHP', slug: 'frameworks/laravel' },
						{ label: 'React, Vue, Svelte, Inertia', slug: 'frameworks/javascript' },
					],
				},
				{ label: 'Catalogs and translation', slug: 'catalogs' },
				{ label: 'Pull requests', slug: 'pull-requests' },
				{ label: 'The web app', slug: 'web-app' },
				{
					label: 'Reference',
					items: [
						{ label: 'Configuration', slug: 'reference/configuration' },
						{ label: 'MCP tools', slug: 'reference/mcp-tools' },
						{ label: 'CLI endpoints', slug: 'reference/endpoints' },
					],
				},
				{ label: 'Troubleshooting', slug: 'troubleshooting' },
			],
		}),
	],
});
