import MarkdownIt from 'markdown-it';

// Initialize markdown-it with options
const md = new MarkdownIt({
  html: false,        // Disable HTML tags in source
  xhtmlOut: false,    // Use '/' to close single tags (<br />)
  breaks: true,       // Convert '\n' in paragraphs into <br>
  linkify: true,      // Autoconvert URL-like text to links
  typographer: true,  // Enable smartquotes and other typographic replacements
  highlight: function (str, lang) {
    // You could add syntax highlighting here if needed
    return `<pre class="language-${lang}"><code>${str}</code></pre>`;
  }
});

/**
 * Format markdown text to HTML
 * 
 * @param {String} text - Markdown text to format
 * @returns {String} HTML formatted text
 */
export function formatMarkdown(text) {
  if (!text) return '';
  return md.render(text);
}

export default {
  formatMarkdown
};
