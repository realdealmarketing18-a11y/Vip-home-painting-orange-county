/* ============================================================
   MD-RENDER — the small markdown subset the research files use

   Not a general markdown library. It renders exactly what Marcus
   writes — headings, tables, lists, quotes, rules, inline emphasis
   and links — and nothing else, because anything else in a research
   file is a mistake we would rather see than silently style.

   Escaping happens FIRST, on the raw text, before any tag is
   introduced. Research files quote competitor copy and scraped review
   text verbatim; a stray < in a review must never become markup.
   ============================================================ */

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const slug = (s) => String(s).toLowerCase()
  .replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);

/* inline — runs on already-escaped text */
function inline(s) {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

const isTableRow = (l) => /^\s*\|/.test(l);
const isDivider  = (l) => /^\s*\|[\s:|-]+\|\s*$/.test(l);

/* Split a table row on unescaped pipes, dropping the leading/trailing empties. */
function cells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
}

/**
 * @param {string} text  raw markdown
 * @returns {{html:string, headings:Array<{level:number,text:string,id:string}>}}
 */
function render(text) {
  const lines = esc(text).split(/\r?\n/);
  const out = [];
  const headings = [];
  let i = 0;
  let para = [];

  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; }
  };

  while (i < lines.length) {
    const line = lines[i];

    /* blank */
    if (!line.trim()) { flushPara(); i++; continue; }

    /* horizontal rule */
    if (/^\s*---+\s*$/.test(line)) { flushPara(); out.push('<hr>'); i++; continue; }

    /* heading */
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushPara();
      const level = h[1].length;
      const raw = h[2].replace(/\s*#+\s*$/, '');
      const id = 'h-' + slug(raw.replace(/&[a-z]+;/g, ''));
      headings.push({ level, text: raw.replace(/\*\*/g, ''), id });
      /* the file's own h1 becomes an h3 here — the page already owns h1/h2 */
      const tag = level === 1 ? 'h3' : level === 2 ? 'h3' : 'h4';
      out.push(`<${tag} id="${id}" class="md-h md-h${level}">${inline(raw)}</${tag}>`);
      i++; continue;
    }

    /* table */
    if (isTableRow(line) && isTableRow(lines[i + 1] || '') && isDivider(lines[i + 1])) {
      flushPara();
      const head = cells(line);
      i += 2;
      const body = [];
      while (i < lines.length && isTableRow(lines[i])) { body.push(cells(lines[i])); i++; }
      out.push(`<div class="tw"><table>
<thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead>
<tbody>${body.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody>
</table></div>`);
      continue;
    }

    /* blockquote */
    if (/^\s*>/.test(line)) {
      flushPara();
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, '')); i++;
      }
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);
      continue;
    }

    /* unordered list */
    if (/^\s*[-*+]\s+/.test(line)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, '')); i++;
      }
      out.push(`<ul>${items.map(t => `<li>${inline(t)}</li>`).join('')}</ul>`);
      continue;
    }

    /* ordered list */
    if (/^\s*\d+\.\s+/.test(line)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++;
      }
      out.push(`<ol>${items.map(t => `<li>${inline(t)}</li>`).join('')}</ol>`);
      continue;
    }

    para.push(line.trim());
    i++;
  }
  flushPara();

  return { html: out.join('\n'), headings };
}

module.exports = { render, esc, slug };
