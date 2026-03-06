# SupaViz

Visualize your Supabase/PostgreSQL schema as an ERD instantly — free and open source.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/aaroncx)

[Try it live](https://aaroncx.github.io/supaviz/)

![screenshot](./screenshot.png)

## Features

- Paste any PostgreSQL DDL SQL and instantly see your schema as an interactive ERD
- Detects tables, columns, types, primary keys, and foreign key relationships
- Auto-layout with animated relationship lines using dagre
- Export diagrams as PNG (2x retina) or SVG
- 3 built-in example schemas: Blog, E-commerce, SaaS Starter
- 100% client-side — your schema never leaves your browser
- Dark mode UI with resizable split panels
- Custom table nodes with PK/FK indicators and type badges

## Getting Started

```bash
git clone https://github.com/AaronCx/supaviz.git
cd supaviz
npm install
npm run dev
```

Open http://localhost:5173/supaviz/ in your browser.

## Supported SQL Patterns

SupaViz parses standard PostgreSQL DDL. Well-supported patterns:

- `CREATE TABLE` with columns, types, and constraints
- `PRIMARY KEY` (column-level and table-level)
- `FOREIGN KEY ... REFERENCES` (inline and table-level `CONSTRAINT`)
- `NOT NULL`, `UNIQUE`, `DEFAULT` constraints
- Supabase patterns: `uuid DEFAULT gen_random_uuid() PRIMARY KEY`
- Schema-qualified references: `REFERENCES auth.users(id)`
- Junction tables for many-to-many relationships

**Known limitations:**
- `ALTER TABLE` statements are not parsed (only `CREATE TABLE`)
- `CREATE INDEX` and `CREATE TYPE` are ignored
- Composite foreign keys are partially supported
- Views and functions are not visualized

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes and add tests
4. Run `npm test` and `npm run lint`
5. Open a pull request

## Support the Project

SupaViz is free forever and open source. If it saves you time, consider buying me a coffee — it helps fund development and keeps the project maintained.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/aaroncx)

## License

MIT
