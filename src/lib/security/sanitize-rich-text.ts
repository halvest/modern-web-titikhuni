import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p", "h2", "h3", "h4", "strong", "em", "blockquote", 
  "ul", "ol", "li", "a", "img", "br"
];

const ALLOWED_ATTRIBUTES = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "title", "width", "height"],
};

export function sanitizeRichText(html: string): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https"], // Prevent ftp, data, javascript
    allowedSchemesByTag: {
      img: ["http", "https"],
      a: ["http", "https"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        // Enforce rel="noopener noreferrer" for external links
        if (attribs.target === "_blank") {
          attribs.rel = "noopener noreferrer";
        }
        return {
          tagName,
          attribs,
        };
      },
    },
    enforceHtmlBoundary: true,
  });
}
