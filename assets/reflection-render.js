(() => {
  const escapeHtml = (text) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const parseInline = (text) => {
    let html = escapeHtml(text);

    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(/_([^_]+)_/g, "<em>$1</em>");
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    return html;
  };

  const markdownToHtml = (markdown) => {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let inList = false;
    let paragraph = [];

    const flushParagraph = () => {
      if (paragraph.length > 0) {
        out.push(`<p>${parseInline(paragraph.join(" "))}</p>`);
        paragraph = [];
      }
    };

    const closeList = () => {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      const trimmed = line.trim();

      if (trimmed === "") {
        flushParagraph();
        closeList();
        continue;
      }

      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        flushParagraph();
        closeList();
        const level = headingMatch[1].length;
        out.push(`<h${level}>${parseInline(headingMatch[2])}</h${level}>`);
        continue;
      }

      if (trimmed.startsWith("> ")) {
        flushParagraph();
        closeList();
        out.push(`<blockquote>${parseInline(trimmed.slice(2))}</blockquote>`);
        continue;
      }

      if (trimmed.startsWith("- ")) {
        flushParagraph();
        if (!inList) {
          out.push("<ul>");
          inList = true;
        }
        out.push(`<li>${parseInline(trimmed.slice(2))}</li>`);
        continue;
      }

      paragraph.push(trimmed);
    }

    flushParagraph();
    closeList();
    return out.join("\n");
  };

  const renderMarkdownContainer = async (container) => {
    const markdownPath = container.getAttribute("data-markdown");
    if (!markdownPath) return;

    try {
      const response = await fetch(markdownPath);
      if (!response.ok) {
        throw new Error(`Failed to load markdown: ${response.status}`);
      }

      const text = await response.text();
      container.innerHTML = markdownToHtml(text);
    } catch (error) {
      container.innerHTML = `<p>Unable to load reflection content.</p><p><code>${escapeHtml(String(error))}</code></p>`;
    }
  };

  const containers = document.querySelectorAll("[data-markdown]");
  containers.forEach((container) => {
    renderMarkdownContainer(container);
  });
})();
