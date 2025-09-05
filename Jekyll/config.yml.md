
# Jekyll Configuration Reference

## 1. Site Identity and URLs

```yaml
title: "Mi Digital Garden"      # Global site title (available as site.title)
description: "Notas y aprendizajes"
url: "https://usuario.github.io"  # Base domain URL (without trailing slash)
baseurl: "/digital-garden"        # Subpath if NOT a user.github.io site
```

**Technical Notes:**
- `url + baseurl` constructs absolute links for the site
- In layouts/links, always use `{{ '/' | relative_url }}` or `{{ '/path' | absolute_url }}` for compatibility between local development and GitHub Pages
- Any additional keys you add here (e.g., author, lang) become available as `site.author`, `site.lang`
- The `url` should be the full domain without trailing slash
- The `baseurl` is used for project sites on GitHub Pages (user sites have empty baseurl)

## 2. Themes and Plugins

```yaml
theme: minima                 # Gem-based theme (if used, no need for custom _layouts)
# remote_theme: owner/repo    # If using jekyll-remote-theme plugin

plugins:
  - jekyll-feed               # RSS/Atom feed generation
  - jekyll-seo-tag            # SEO metadata tags
  - jekyll-sitemap            # sitemap.xml generation
  # - jekyll-paginate         # Classic pagination (if needed)
```

**Technical Notes:**
- `theme`: Activates a gem-packaged theme from RubyGems
- `remote_theme`: Uses themes directly from GitHub repositories (requires jekyll-remote-theme plugin)
- `plugins`: List of plugins to load. GitHub Pages has a whitelist of allowed plugins; outside GitHub Pages you can use any plugin
- When using a theme, you don't need custom `_layouts` unless you want to override theme layouts
- Plugins extend Jekyll functionality and are essential for features like RSS feeds and SEO

## 3. Paths and Directory Structure

```yaml
source: .             # Project root directory (default: ".")
destination: _site    # Generated output (HTML/CSS/JS)
includes_dir: _includes
layouts_dir: _layouts
collections_dir: .    # Where collections live (default: root)
data_dir: _data       # .yml/.json/.csv files accessible as site.data
```

**Technical Notes:**
- `source`: Root directory where Jekyll looks for content to process
- `destination`: Output directory where generated site files are placed
- `includes_dir`: Directory for reusable Liquid templates (accessed via `{% include %}`)
- `layouts_dir`: Directory containing layout templates
- `collections_dir`: Base directory for collections (collections are in `_collection_name/` folders)
- `data_dir`: Directory for data files that become available in Liquid as `site.data`

## 4. Content Processing

```yaml
markdown: kramdown
highlighter: rouge
markdown_ext: "markdown,mkdown,mkdn,mkd,md"   # Extensions treated as Markdown

kramdown:
  input: GFM              # GitHub Flavored Markdown support (tables, lists, etc.)
  hard_wrap: false
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    line_numbers: false

excerpt_separator: "<!--more-->"  # Manual marker for page/post excerpt
permalink: pretty                 # Global permalink style (pages and posts)
```

**Technical Notes:**
- `markdown: kramdown`: Uses Kramdown as the Markdown processor (fast and feature-rich)
- `highlighter: rouge`: Syntax highlighting engine for code blocks
- `kramdown.input: GFM`: Enables GitHub Flavored Markdown features (tables, strikethrough, task lists)
- `excerpt_separator`: Controls where Jekyll cuts the excerpt (available as `{{ page.excerpt }}`)
- `permalink`: Global permalink style accepts values like `pretty`, `date`, `none`, or custom templates
- `hard_wrap: false`: Prevents automatic line breaks in paragraphs
- `line_numbers: false`: Disables line numbers in code blocks for cleaner output

## 5. Collections

```yaml
collections:
  linux:
    output: true                  # Generate HTML for each document
    permalink: /linux/:name/      # URL template for _linux/ docs

# Default values applied to a collection:
defaults:
  - scope:
      path: ""                    # Within the entire project
      type: linux                 # Collection name
    values:
      layout: default             # Default layout for _linux/*
```

**Technical Notes:**
- Collections create folders prefixed with `_` (e.g., `_linux/`, `_notes/`)
- Each `.md` file inside must have front matter (`---`) to be processed
- `output: true` generates individual HTML pages for each document
- `output: false` makes documents available in Liquid but doesn't generate pages

**Useful placeholders in collection permalinks:**
- `:name` - filename without extension
- `:path` - internal path within collection
- `:collection` - collection name
- `:output_ext` - output extension (usually `.html`)

**Example:** `/notes/:path/` → `_notes/go/slog.md` becomes `/notes/go/slog/`

## 6. File Inclusion/Exclusion and Preservation

```yaml
exclude:
  - README.md
  - scripts/
  - node_modules/
include:
  - ".well-known"    # Force include something that would normally be excluded
keep_files:
  - ".git"           # Don't delete certain paths within _site when regenerating
```

**Technical Notes:**
- `exclude`: Jekyll will not process or copy these paths during build
- `include`: Forces inclusion of files that would normally be excluded (useful for dotfiles)
- `keep_files`: Prevents Jekyll from deleting certain paths within `_site/` between builds
- Excluded files are completely ignored by Jekyll's processing pipeline
- Include is useful for files starting with dots (like `.well-known` for security.txt)
- Keep_files is essential for preserving custom files in the output directory

## 7. Build and Server Flags (also available as CLI flags)

```yaml
# Build Configuration
future: false         # Publish content dated in the future?
unpublished: false    # Include items with 'published: false'?
lsi: false            # Related posts with LSI (requires 'classifier-reborn')
encoding: "utf-8"
timezone: "America/Santiago"   # Affects times/dates (site.time)

# Serve Configuration (when using `jekyll serve`)
host: 127.0.0.1
port: 4000
livereload: true      # Auto-reload (if your version supports it)
watch: true           # Watch for changes on disk
incremental: false    # Incremental build (experimental: use with caution)

# Local server headers (WEBrick)
webrick:
  headers:
    Cache-Control: "no-cache"
```

**Technical Notes:**
- Most of these parameters can be passed via CLI: `jekyll serve --livereload --host 0.0.0.0 --port 8080`
- `future: false` prevents publishing posts with future dates (useful for scheduled content)
- `unpublished: false` excludes content marked with `published: false` in front matter
- `lsi: false` disables Latent Semantic Indexing for related posts (requires additional gem)
- `incremental: true` can speed up builds but may miss some changes (experimental feature)
- `livereload: true` automatically refreshes browser when files change
- `watch: true` monitors file system for changes during development

## 8. SASS/SCSS Configuration

```yaml
sass:
  sass_dir: _sass      # Directory for .scss partials
  style: compressed    # expanded | compressed
```

**Technical Notes:**
- If you use SCSS in your themes/layouts, this controls compilation and output style
- `sass_dir`: Directory where Jekyll looks for SCSS partials and imports
- `style: compressed` produces minified CSS for production (smaller file size)
- `style: expanded` produces readable CSS for development (easier debugging)
- SCSS files in `_sass/` are treated as partials and won't generate individual CSS files

## 9. Permalinks (Templates and Placeholders)

At global level or by type (posts/collections) you can use templates:

**Predefined styles:** `pretty`, `date`, `ordinal`, `none`

**Custom templates (examples):**

```yaml
# Global
permalink: /:categories/:title/

# Only for posts
collections:
  posts:
    output: true
    permalink: /blog/:year/:month/:day/:title/
```

**Available placeholders:**

**Posts:** `:year`, `:month`, `:day`, `:title`, `:categories`

**Pages/Collections:** `:name`, `:path`, `:collection`, `:output_ext`

**Technical Notes:**
- Permalinks control the URL structure of generated pages
- `pretty` adds trailing slashes and removes `.html` extensions
- `date` uses post date in URL structure
- `ordinal` uses day of year instead of month/day
- `none` uses the original filename structure
- Custom templates allow fine-grained control over URL patterns


## 10. Liquid Template Engine

```yaml
liquid:
  error_mode: warn          # lax | warn | strict
  strict_filters: false
  strict_variables: false
```

**Technical Notes:**
- Controls how Liquid reacts to non-existent filters/variables
- `error_mode: warn` shows warnings for undefined variables/filters but continues processing
- `error_mode: strict` stops processing on any undefined variable/filter
- `error_mode: lax` silently ignores undefined variables/filters
- `strict_filters: true` requires all filters to be defined
- `strict_variables: true` requires all variables to be defined
- Recommended: `warn` mode for development, `strict` for production

## 11. Custom Values (Free-form)

Any key you add becomes available as `site.<key>`:

```yaml
author: "Angel Andrade"
github: "https://github.com/Atrabilis"
links:
  - text: "Inicio"
    href: "/"
  - text: "Linux"
    href: "/linux/"
```

**Usage in layouts:**

```liquid
<nav>
  {% for item in site.links %}
    <a href="{{ item.href | relative_url }}">{{ item.text }}</a>
  {% endfor %}
</nav>
```

**Technical Notes:**
- Custom configuration values are accessible throughout the site via `site.<key>`
- Useful for storing site-wide data like author info, social links, navigation menus
- Can store complex data structures (arrays, objects) for dynamic content generation
- Values are available in all Liquid templates (layouts, includes, pages, posts)

## 12. Environment-specific Configuration (Optional, Advanced)

You can have multiple files and combine them by environment:

```
_config.yml
_config_production.yml
```

**Local build:**
```bash
jekyll serve
```

**Production build:**
```bash
JEKYLL_ENV=production jekyll build \
  --config _config.yml,_config_production.yml
```

**Usage in Liquid:**
```liquid
{% if jekyll.environment == "production" %} ... {% endif %}
```

**Technical Notes:**
- Environment-specific configs allow different settings for development vs production
- Use `--config` flag to specify multiple config files (comma-separated)
- Later files override earlier ones (production overrides base config)
- `jekyll.environment` variable is available in Liquid templates
- Useful for different URLs, analytics, or feature flags per environment

## 13. Recommended Configuration for "Digital Garden" (Base Template)

```yaml
title: "Mi Digital Garden"
description: "Notas y aprendizajes"
url: "https://usuario.github.io"         # Change this
baseurl: "/digital-garden"               # If project site; empty for user site

# Use theme or create your own 'default' layout
theme: minima
# plugins: [jekyll-feed, jekyll-seo-tag, jekyll-sitemap]

collections:
  linux:
    output: true
    permalink: /linux/:name/
  # If you want a single collection with subfolders:
  # notes:
  #   output: true
  #   permalink: /notes/:path/

defaults:
  - scope:
      path: ""
      type: linux
    values:
      layout: default

markdown: kramdown
highlighter: rouge
kramdown:
  input: GFM

exclude:
  - node_modules/
  - scripts/
  - README.md

timezone: "America/Santiago"
```

**Technical Notes:**
- With this configuration, `_linux/dpkg.md` (with front matter) will publish at `/linux/dpkg/`
- Provides a solid foundation for growing your digital garden
- Collections allow organizing content by topic while maintaining clean URLs
- Kramdown with GFM provides rich Markdown features for technical documentation
- Exclude unnecessary files to speed up builds and reduce output size
