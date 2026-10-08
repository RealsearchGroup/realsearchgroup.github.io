# Updating the Realsearch website

Everything on the site is a small text file. To add or change something, add or edit one file and open a pull request. You can do all of it in the browser on GitHub (no git or Ruby needed): open the folder, click **Add file → Create new file**, paste a template below, then **Commit changes → Create a pull request**.

When you open the pull request a check runs automatically and tells you in plain English if something is missing or mistyped.

| I want to… | Add or edit a file in… |
|---|---|
| add or update myself | `_people/` |
| add a paper | `_publications/` |
| post news | `_posts/` |
| add a gallery photo | `_pictures/` |
| describe a research project | `_projects/` |

## Naming rules (cheat sheet)

Use lowercase letters, numbers and hyphens only. No spaces, no capitals, no underscores.

| Thing | File name | Example |
|---|---|---|
| Person | `_people/firstname-lastname.md` | `_people/jane-doe.md` |
| Person's photo | `img/people/firstname-lastname.jpg` (same name as the person file) | `img/people/jane-doe.jpg` |
| Paper | `_publications/year-a-few-title-words.md` | `_publications/2026-closing-the-chain.md` |
| News post | `_posts/YYYY-MM-DD-short-title.md` (**the date prefix is required**) | `_posts/2026-03-02-jane-icse-2026.md` |
| News picture (optional) | `img/news/short-title.png` | `img/news/icse-2026.png` |
| Gallery entry | `_pictures/YYYY-MM-DD.md` (the event date) | `_pictures/2026-03-02.md` |
| Gallery photo | `img/gallery/short-description.jpg` | `img/gallery/spring-2026-dinner.jpg` |
| Research project | `_projects/short-name.md` | `_projects/secret-detection.md` |
| Project image | `img/projects/short-name.jpg` | `img/projects/secret-detection.jpg` |

Images: `.jpg` (or `.png` for logos), under about 1MB. Names must be unique, because a new file with an existing name replaces the old one.

Each person's page (`/people/<name>/`) automatically lists every paper whose `authors` line contains their name, so you only ever enter a paper once.

## Add yourself — `_people/firstname-lastname.md`

Upload your photo to `img/people/` first. Leave out any line you don't need. If there is no `image`, a colored badge with your initials is shown instead.

**Photo naming and size:** name the file the same as your people file, in lowercase with hyphens: `jane-doe.jpg` for `_people/jane-doe.md`. Use `.jpg`, roughly square (the site crops it to a circle around the center, so keep your face centered), at least 400px and at most about 1MB.

```yaml
---
name: Jane Doe
role: grad            # faculty | postdoc | grad | alum | ms   (ms = undergraduate/masters alumnus who did not do a PhD here)
image: /img/people/jane.jpg
website: https://example.com
linkedin: https://www.linkedin.com/in/janedoe/
github: janedoe       # username only
scholar: https://scholar.google.com/citations?user=XXXX
position: Research Assistant   # optional, shown under your name
aliases:              # other spellings of your name used on papers
  - Jane Q. Doe
---
```

Optional: if you are a current member who was also an undergraduate or masters student here, add `also: ms` and you will be listed under "Undergraduate and Masters Alumni" as well.

Each of `website`, `linkedin`, `github` and `scholar` becomes a button on your page. Text written below the closing `---` shows up on your page as a short bio.

### When you graduate or leave

Change `role: grad` to `role: alum` in your file. Optionally add where you went:

```yaml
role: alum
joined: 2021
left: 2026
now: "Software Engineer at Example Inc."
```

Your page and all your papers stay on the site.

## Add a paper — `_publications/2026-short-title.md`

The file name only has to be unique; `year-a-few-words-of-the-title.md` works well.

```yaml
---
title: "The Full Title of the Paper"
authors: "Jane Doe, Laurie Williams"
year: 2026
venue: "IEEE/ACM International Conference on Software Engineering (ICSE)"
type: inproceedings   # inproceedings (conference/workshop) | article (journal) | book
link: https://doi.org/10.0000/example
project: security-requirements   # optional: name of a file in _projects/ (without .md)
---
```

- Write authors exactly as they appear on the paper, separated by commas. Names are matched against `name` and `aliases` in `_people/`.
- Put the title and any value containing a colon (`:`) inside "double quotes".
- `link` and `project` are optional.

## Post news — `_posts/YYYY-MM-DD-short-title.md`

The date in the file name is the date shown on the post, and it is required.

```yaml
---
layout: post
shortnews: false
icon: newspaper-o
title: Jane's paper accepted at ICSE 2026
image: /img/news/icse-2026.png       # optional; leave this line out for no picture
---

Jane's paper titled "The Full Title", co-authored with Dr. Laurie Williams, accepted at ICSE 2026.
```

The first paragraph is the preview shown on the home page and News page.

## Add a gallery photo — `_pictures/YYYY-MM-DD.md`

Upload the photo to `img/gallery/` first, then add:

```yaml
---
title: Spring 2026 Dinner
subtitle: Dinner Gathering
description: One sentence shown under the photo on the Gallery page and on the photo's own page.
layout: picture
last-updated: 2026-03-02             # same date as the file name; controls the Gallery order
image: /img/gallery/spring-2026-dinner.jpg
---

Optional longer text shown on the photo's own page.
```

## Add a research project — `_projects/short-name.md`

Every project page uses the same format. Copy `_projects/risk-based-secret-management.md` and edit it:

```yaml
---
title: Project Name
subtitle: One-line summary            # optional
status: active
description: Two or three sentences. This is shown on the Research page AND at the top of the project's own page.
image: /img/projects/short-name.jpg  # optional; upload the file to img/projects/
image_credit: "Image attribution…"    # optional caption under the image
layout: project
last-updated: 2026-01-31              # controls the order on the Research page
link: false
---

## Research questions        (or "Research contributions", "Motivation", "Funding", …)

- First point
- Second point
```

Use `##` headings for sections and bullet lists for points. Papers whose `project:` matches this file's name appear automatically under "Related publications", along with their current authors.

## Preview the site on your computer (optional)

```
bundle install
bundle exec jekyll serve      # then open http://127.0.0.1:4000
ruby scripts/validate.rb      # the same check that runs on pull requests
```
