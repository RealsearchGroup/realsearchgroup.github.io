#!/usr/bin/env ruby
# Checks the data files that students edit and explains problems in plain English.
# Usage: ruby scripts/validate.rb        (exit code 1 if anything must be fixed)
require 'yaml'
require 'date'

ROOT = File.expand_path('..', __dir__)
ROLES = %w[faculty postdoc grad ms alum staff collab ugrad ugrad-alum].freeze
TYPES = %w[inproceedings article book].freeze

@errors = []
@warnings = []

def err(file, msg)  = @errors << "#{file.sub("#{ROOT}/", '')}: #{msg}"
def warn_(file, msg) = @warnings << "#{file.sub("#{ROOT}/", '')}: #{msg}"

def front_matter(file)
  text = File.read(file)
  unless text.start_with?("---\n")
    err(file, 'file must start with a line containing only three dashes (---)')
    return nil
  end
  parts = text.split(/^---\s*$\n/, 3)
  data = YAML.safe_load(parts[1].to_s, permitted_classes: [Date, Time]) || {}
  err(file, 'the top of the file is not valid key: value text') unless data.is_a?(Hash)
  data.is_a?(Hash) ? data : nil
rescue Psych::SyntaxError => e
  err(file, "could not read the top of the file (#{e.message.lines.first.strip}). " \
            'Tip: wrap values containing a colon (:) or quotes in "double quotes".')
  nil
end

def blank?(v) = v.nil? || v.to_s.strip.empty?
def year_ok?(v) = v.to_s =~ /\A(19|20)\d\d\z/

# ---- people
people = []
Dir[File.join(ROOT, '_people', '*.md')].sort.each do |f|
  d = front_matter(f) or next
  people << d
  err(f, 'missing "name"') if blank?(d['name'])
  if blank?(d['role'])
    err(f, 'missing "role" (one of: faculty, postdoc, grad, ms, alum)')
  elsif !ROLES.include?(d['role'])
    err(f, %(role "#{d['role']}" is not valid; use faculty, postdoc, grad, ms or alum))
  end
  if d['image'] && d['image'].to_s.start_with?('/') &&
     !File.exist?(File.join(ROOT, d['image'].to_s))
    err(f, %(image "#{d['image']}" was not found; upload the photo to img/people/ first))
  end
  if d['also'] && !ROLES.include?(d['also'])
    err(f, %("also" "#{d['also']}" is not a valid role; use ms or alum))
  end
  %w[joined left].each do |k|
    err(f, %("#{k}" should be a 4-digit year, e.g. 2024)) if d[k] && !year_ok?(d[k])
  end
  err(f, '"aliases" must be a list of names') if d['aliases'] && !d['aliases'].is_a?(Array)
end

known = people.flat_map { |p| [p['name'], *Array(p['aliases'])] }.compact

# ---- projects (for the optional "project:" tag on publications)
projects = Dir[File.join(ROOT, '_projects', '*.md')].map { |f| File.basename(f, '.md') }

# ---- publications
seen = {}
pub_files = Dir[File.join(ROOT, '_publications', '*.md')].sort
pub_files.each do |f|
  d = front_matter(f) or next
  %w[title authors venue].each { |k| err(f, %(missing "#{k}")) if blank?(d[k]) }
  if blank?(d['year'])
    err(f, 'missing "year"')
  elsif !year_ok?(d['year'])
    err(f, %("year" should be a 4-digit number, e.g. 2025 (found "#{d['year']}")))
  end
  if blank?(d['type'])
    err(f, 'missing "type" (inproceedings, article or book)')
  elsif !TYPES.include?(d['type'])
    err(f, %(type "#{d['type']}" is not valid; use inproceedings, article or book))
  end
  if d['link'] && d['link'].to_s !~ %r{\Ahttps?://}
    err(f, %("link" must start with http:// or https:// (found "#{d['link']}")))
  end
  if d['project'] && !projects.include?(d['project'])
    err(f, %(project "#{d['project']}" does not match any file in _projects/ (use the file name without .md)))
  end
  if !blank?(d['authors']) && known.none? { |n| d['authors'].to_s.include?(n) }
    warn_(f, 'none of the authors match a person in _people/ (fine for outside authors; ' \
             'otherwise check the spelling or add an "aliases" entry to the person)')
  end
  key = "#{d['title'].to_s.downcase.strip}|#{d['year']}"
  warn_(f, "looks like a duplicate of #{seen[key]}") if seen[key]
  seen[key] ||= File.basename(f)
end

@warnings.each { |w| puts "warning: #{w}" }
@errors.each   { |e| puts "ERROR:   #{e}" }
puts "\n#{people.size} people, #{pub_files.size} publications checked: " \
     "#{@errors.size} error(s), #{@warnings.size} warning(s)."
exit(@errors.empty? ? 0 : 1)
