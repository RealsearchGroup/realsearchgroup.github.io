# Realsearch Research Group website

Source for the Realsearch group website, built with [Jekyll](https://jekyllrb.com/).

**To add or update people, publications, news, photos or projects, see [CONTRIBUTING.md](CONTRIBUTING.md).**

## Run locally

```
bundle install
bundle exec jekyll serve
```

Then open http://127.0.0.1:4000. `ruby scripts/validate.rb` checks the people and publication files.

## Layout

| Path | Contents |
|---|---|
| `_people/` | one file per person |
| `_publications/` | one file per paper |
| `_posts/`, `_pictures/`, `_projects/` | news, gallery, research projects |
| `_layouts/`, `_includes/` | page templates |
| `css/group.scss`, `js/site.js` | styles and scripts |
| `scripts/validate.rb` | data checks, also run by `.github/workflows/check.yml` |

Originally based on [uwsampa/research-group-web](https://github.com/uwsampa/research-group-web/).
