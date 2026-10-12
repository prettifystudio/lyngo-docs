# Lyngo docs

The manual at docs.lyngo.app. Astro Starlight; every page is also served as Markdown (`<path>.md`), and `llms.txt` / `llms-full.txt` hold the index and the whole manual for agents.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

Pages live in `src/content/docs`. Short sentences, one instruction each, real terminal output in code blocks.
