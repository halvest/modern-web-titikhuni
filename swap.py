import sys
import re

with open(r"e:\project-new\modern-web-titikhuni\src\app\(marketing)\proyek\[slug]\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("<article>")
pre_article = parts[0]
article_parts = parts[1].split("</article>")
inside_article = article_parts[0]
post_article = article_parts[1]

desc_split = inside_article.split("{/* ── PHOTO GALLERY CAROUSEL ───────────────────────────── */}")
description_section = desc_split[0]
gallery_section = "{/* ── PHOTO GALLERY CAROUSEL ───────────────────────────── */}" + desc_split[1]

# Modify gallery section
gallery_section = re.sub(
    r'const aspectClass =[\s\S]*?return \(',
    'return (',
    gallery_section
)

gallery_section = gallery_section.replace(
    'className={`relative shrink-0 snap-start overflow-hidden rounded-2xl bg-surface-muted md:rounded-3xl ${aspectClass}`}',
    'className="relative shrink-0 snap-start overflow-hidden rounded-2xl bg-surface-muted md:rounded-3xl aspect-[4/3] w-[85vw] sm:w-[65vw] md:aspect-video md:w-[55vw] lg:w-[45vw]"'
)

gallery_section = gallery_section.replace('className="pb-16 md:pb-24"', 'className="pb-16 pt-12 md:pb-24 md:pt-16 lg:pt-20"')

description_section = description_section.replace('className="site-container py-14 md:py-20 lg:py-24"', 'className="site-container border-t border-foreground/10 py-14 md:py-20 lg:py-24"')

gallery_section = gallery_section.replace('className="site-container mb-8 flex items-end justify-between border-t border-foreground/10 pt-8 md:mb-10 md:pt-10"', 'className="site-container mb-8 flex items-end justify-between md:mb-10"')

new_inside_article = "\n" + gallery_section.strip() + "\n\n" + description_section.strip() + "\n      "
new_content = pre_article + "<article>" + new_inside_article + "</article>" + post_article

with open(r"e:\project-new\modern-web-titikhuni\src\app\(marketing)\proyek\[slug]\page.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Done")
