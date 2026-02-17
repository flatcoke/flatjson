# { flatJSON }

> Fast, client-side JSON & YAML parser — no signup, no server, no tracking.

🔗 **[flatjson.dev](https://flatjson.dev)**

## Features

- **JSON & YAML** — auto-detects input format, parse both seamlessly
- **Tree View** — interactive, collapsible nested structure with type badges
- **Vim Mode** — full Vim keybindings via CodeMirror (`@replit/codemirror-vim`)
- **Format / Minify** — one-click prettify or compact JSON
- **JSON ↔ YAML** — convert between formats instantly
- **Themes** — multiple color themes for the tree view
- **Large File Support** — handles 1MB+ files with lite mode (virtualized rendering)
- **100% Client-Side** — nothing leaves your browser. Ever.

## Why flatJSON?

There are plenty of JSON tools out there. flatJSON focuses on being **fast, keyboard-friendly, and private**:

| | flatJSON | jsonlint.com | jsonformatter.org |
|---|:---:|:---:|:---:|
| Vim keybindings | ✅ | ❌ | ❌ |
| YAML support | ✅ | ❌ | ❌ |
| Tree view | ✅ | ❌ | ✅ |
| No ads | ✅ | ❌ | ❌ |
| No tracking | ✅ | ❌ | ❌ |
| Large file handling | ✅ | ❌ | ❌ |

## Tech Stack

- [Next.js](https://nextjs.org) (static export)
- [CodeMirror 6](https://codemirror.net/) with Vim extension
- [Tailwind CSS](https://tailwindcss.com)
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com)

## Development

```bash
git clone https://github.com/flatcoke/flatjson.git
cd flatjson
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contributing

Issues and PRs welcome! If you find a bug or have a feature request, [open an issue](https://github.com/flatcoke/flatjson/issues).

## License

MIT © [flatcoke](https://github.com/flatcoke)
