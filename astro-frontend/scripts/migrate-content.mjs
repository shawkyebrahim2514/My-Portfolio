// One-time migration: Sanity export JSON -> Astro content collections (MDX + JSON).
// Usage: node scripts/migrate-content.mjs <path-to-sanity-export-dir>
//
// Resolves skill/technology + image-asset references, downloads SVG icons into
// public/icons, converts the legacy custom markdown dialect into MDX that uses
// the prose components, and writes everything under src/content + public.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const exportDir = process.argv[2];
if (!exportDir) {
  console.error('Provide the path to the sanity-export directory.');
  process.exit(1);
}

const read = (name) =>
  JSON.parse(
    readFileSync(join(exportDir, name), 'utf8').replace(/^\uFEFF/, ''),
  );
const ensureDir = (p) => mkdirSync(p, { recursive: true });
const write = (p, content) => {
  ensureDir(dirname(p));
  writeFileSync(p, content, 'utf8');
};

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ---- Load source ----
const portfolio = read('portfolio.json');
const skills = read('skills.json');
const contacts = read('contacts.json');
const projects = read('projects.json');
const professional = read('professionalExperience.json');
const internships = read('internships.json');
const certificatesRaw = read('certificates.json');
const certificates = Array.isArray(certificatesRaw)
  ? certificatesRaw
  : [certificatesRaw];
const collegeCourses = read('collegeCourses.json');
const imageAssets = read('imageAssets.json');

const pages = Object.fromEntries(portfolio.pages.map((p) => [p._type, p]));

// ---- Reference maps ----
const assetUrlById = new Map(imageAssets.map((a) => [a._id, a.url]));
const skillNameById = new Map(skills.map((s) => [s._id, s.name]));
const courseById = new Map(collegeCourses.map((c) => [c._id, c]));

const resolveTechNames = (techs = []) =>
  techs.map((t) => skillNameById.get(t._ref)).filter(Boolean);

// ---- Icon downloads ----
const downloads = [];
function queueIcon(asset, kind, slug) {
  const url = assetUrlById.get(asset?.asset?._ref);
  if (!url) return undefined;
  const ext = url.split('.').pop().split('?')[0];
  const rel = `/icons/${kind}/${slug}.${ext}`;
  downloads.push({ url, dest: join(root, 'public', rel) });
  return rel;
}

// ---- Markdown dialect -> MDX ----
function inlineTransforms(text) {
  let out = text;
  // Link buttons: [[label|type]](url)  /  [[label]](url)
  out = out.replace(
    /\[\[([^\]|]+?)(?:\|(doc|link))?\]\]\(([^)]+)\)/g,
    (_m, label, type, url) =>
      `<LinkButton href="${url}"${type ? ` icon="${type}"` : ''}>${label.trim()}</LinkButton>`,
  );
  // Tags: [[Tag]]
  out = out.replace(
    /\[\[([^\]]+?)\]\]/g,
    (_m, label) => `<Tag>${label.trim()}</Tag>`,
  );
  // Highlights (order matters: area-secondary, secondary, area)
  out = out.replace(
    /\*\*!-(.+?)-!\*\*/g,
    (_m, c) => `<Highlight variant="area-secondary">${c}</Highlight>`,
  );
  out = out.replace(
    /\*\*!(.+?)!\*\*/g,
    (_m, c) => `<Highlight variant="secondary">${c}</Highlight>`,
  );
  out = out.replace(
    /\*\*-(.+?)-\*\*/g,
    (_m, c) => `<Highlight variant="area">${c}</Highlight>`,
  );
  // Inline gap token
  out = out.replace(/\[gap\]/g, '<Spacer />');
  return out;
}

const imageRe =
  /!\[([^\]]*)\]\(([^)\s]+)(?:\s+=(?:(\d+)x(\d+)|([wh])(\d+)))?(?:\|(center|left|right))?\)/g;

function imageTransform(line) {
  return line.replace(
    imageRe,
    (_m, alt, url, wh1, hh1, whLetter, whNum, align) => {
      let width, height;
      if (wh1 && hh1) {
        width = wh1;
        height = hh1;
      } else if (whLetter === 'w') {
        width = whNum;
      } else if (whLetter === 'h') {
        height = whNum;
      }
      const attrs = [
        `src="${url}"`,
        `alt="${(alt || '').replace(/"/g, '&quot;')}"`,
        width ? `width={${width}}` : '',
        height ? `height={${height}}` : '',
        align ? `align="${align}"` : '',
      ]
        .filter(Boolean)
        .join(' ');
      return `<ProseImage ${attrs} />`;
    },
  );
}

// Process a list of (already >-stripped) lines into MDX, handling nested
// `>` quote groups recursively and block tokens.
function processLines(lines) {
  const result = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Nested quote group (lines still starting with '>')
    if (/^\s*>/.test(line)) {
      const group = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        group.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      const inner = processLines(group).trim();
      result.push(`<Quote>\n${inner}\n</Quote>`);
      continue;
    }

    i++;
    let work = line;

    // Block alignment token: [center]/[left]/[right]
    const alignMatch = work.match(/\[(center|left|right)\]/);
    if (alignMatch) {
      work = work.replace(/\s*\[(center|left|right)\]\s*/, '').trim();
      const transformed = imageTransform(inlineTransforms(work));
      result.push(
        `<Center align="${alignMatch[1]}">\n${transformed}\n</Center>`,
      );
      continue;
    }

    // Trailing/standalone [newline] -> spacer
    if (/\[newline\]/.test(work)) {
      const before = work.replace(/\[newline\]/g, '').trim();
      if (before) result.push(imageTransform(inlineTransforms(before)));
      result.push('<Spacer />');
      continue;
    }

    if (work.trim() === '') {
      result.push('');
      continue;
    }

    result.push(imageTransform(inlineTransforms(work)));
  }
  return result.join('\n');
}

// Convert a full description string into MDX body.
function convert(md) {
  const rawLines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];
    // Top-level blockquote block
    if (/^\s*>/.test(line)) {
      const group = [];
      while (i < rawLines.length && /^\s*>/.test(rawLines[i])) {
        group.push(rawLines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      // Callout marker?
      const calloutIdx = group.findIndex((l) => /\[!([^\]]+)\]/.test(l));
      let isCallout = false;
      if (calloutIdx !== -1) {
        isCallout = true;
        group[calloutIdx] = group[calloutIdx]
          .replace(/\[!([^\]]+)\]/, '')
          .trim();
        if (group[calloutIdx] === '') group.splice(calloutIdx, 1);
      }
      const inner = processLines(group).trim();
      blocks.push(
        isCallout
          ? `<Callout>\n${inner}\n</Callout>`
          : `<Quote>\n${inner}\n</Quote>`,
      );
      continue;
    }
    // Non-quote line
    blocks.push(processLines([line]));
    i++;
  }
  // Collapse 3+ blank lines, trim.
  return (
    blocks
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  );
}

function yamlScalar(v) {
  if (typeof v === 'number') return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
}

function frontmatter(obj) {
  const lines = ['---'];
  const emit = (k, v, indent = '') => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      if (v.length === 0) {
        lines.push(`${indent}${k}: []`);
        return;
      }
      lines.push(`${indent}${k}:`);
      v.forEach((item) => lines.push(`${indent}  - ${yamlScalar(item)}`));
    } else if (typeof v === 'object') {
      lines.push(`${indent}${k}:`);
      Object.entries(v).forEach(([kk, vv]) => emit(kk, vv, indent + '  '));
    } else {
      lines.push(`${indent}${k}: ${yamlScalar(v)}`);
    }
  };
  Object.entries(obj).forEach(([k, v]) => emit(k, v));
  lines.push('---');
  return lines.join('\n');
}

// ================= Build collections =================

// Skills: map skill _id -> category via skillsPage
const skillCategory = new Map();
const skillsPage = pages.skillsPage;
skillsPage.categories.forEach((cat) => {
  cat.skills.forEach((ref) => skillCategory.set(ref._ref, cat.title));
});
const skillsOut = skills.map((s, idx) => {
  const slug = slugify(s.name);
  const icon = queueIcon(s.icon, 'skills', slug);
  return {
    id: slug,
    name: s.name,
    icon: icon ?? '',
    category: skillCategory.get(s._id) ?? 'General',
    order: idx,
  };
});
write(
  join(root, 'src/content/skills/skills.json'),
  JSON.stringify(skillsOut, null, 2) + '\n',
);

// Contacts
const contactsPage = pages.contactsPage;
const contactOrder = new Map(
  (contactsPage?.contacts ?? []).map((ref, idx) => [ref._ref, idx]),
);
const contactsOut = contacts.map((c, idx) => {
  const slug = slugify(c.name);
  const icon = queueIcon(c.icon, 'contacts', slug);
  return {
    id: slug,
    name: c.name,
    icon: icon ?? '',
    link: c.link,
    order: contactOrder.get(c._id) ?? idx,
  };
});
write(
  join(root, 'src/content/contacts/contacts.json'),
  JSON.stringify(contactsOut, null, 2) + '\n',
);

// Courses (ordered by educationPage)
const eduPage = pages.educationPage;
const courseRefs = eduPage.education.courses ?? [];
const coursesOut = courseRefs.map((ref, idx) => {
  const c = courseById.get(ref._ref);
  return {
    id: slugify(c.name),
    name: c.name,
    description: c.description,
    order: idx,
  };
});
write(
  join(root, 'src/content/courses/courses.json'),
  JSON.stringify(coursesOut, null, 2) + '\n',
);

// About
const about = pages.aboutPage;
write(
  join(root, 'src/content/about/shawky.mdx'),
  frontmatter({
    personName: about.personName,
    position: about.position,
    salutation: about.salutation,
    seeking: about.seeking,
    personImage: about.personImage,
    resume: { text: about.resume.text, link: about.resume.link },
  }) +
    '\n\n' +
    convert(about.description),
);

// Projects
const projectsPage = pages.projectsPage;
const projectOrder = new Map(
  (projectsPage?.projects ?? []).map((ref, idx) => [ref._ref, idx]),
);
projects.forEach((p) => {
  const slug = slugify(p.name);
  write(
    join(root, `src/content/projects/${slug}.mdx`),
    frontmatter({
      name: p.name,
      order: projectOrder.get(p._id) ?? 0,
      projectLink: p.links?.projectLink,
      demoLink: p.links?.demoLink,
      technologies: resolveTechNames(p.technologies),
    }) +
      '\n\n' +
      convert(p.description),
  );
});

// Experience (professional, internships, certificates)
function normalizeDate(d) {
  if (!d) return undefined;
  if (typeof d === 'string') return { from: d };
  return { from: d.from, to: d.to };
}
function writeExperience(items, kind) {
  items.forEach((it, idx) => {
    const slug = slugify(it.title);
    const subtitle =
      it.subTitle && it.subTitle !== '-' ? it.subTitle : undefined;
    write(
      join(root, `src/content/experience/${slug}.mdx`),
      frontmatter({
        title: it.title,
        subtitle,
        kind,
        date: normalizeDate(it.date),
        link: it.link,
        technologies: resolveTechNames(it.technologies),
        order: idx,
      }) +
        '\n\n' +
        convert(it.description),
    );
  });
}
writeExperience(professional, 'professional');
writeExperience(internships, 'internship');
writeExperience(certificates, 'certificate');

// Education
write(
  join(root, 'src/content/education/cairo-university.mdx'),
  frontmatter({
    name: eduPage.education.name,
    location: eduPage.education.location,
    date: {
      start: eduPage.education.date.start,
      end: eduPage.education.date.end,
    },
    order: 0,
  }) +
    '\n\n' +
    convert(eduPage.education.description),
);

// ---- Download icons ----
console.log(`Downloading ${downloads.length} icons...`);
let ok = 0;
for (const { url, dest } of downloads) {
  if (existsSync(dest)) {
    ok++;
    continue;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    ensureDir(dirname(dest));
    writeFileSync(dest, buf);
    ok++;
  } catch (e) {
    console.warn(`  ! failed ${url}: ${e.message}`);
  }
}
console.log(`Icons: ${ok}/${downloads.length} ready.`);
console.log('Migration complete.');
