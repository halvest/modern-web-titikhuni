export type PostStatus = "draft" | "published" | "archived";

export interface PostFormData {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  category_id: string;
  status: PostStatus;
  
  // Tags
  tags: string[]; // List of tag names

  // SEO
  seo_title: string;
  meta_description: string;
  canonical_url: string;
  is_indexed: boolean;
  og_image: string;

  // Relations
  related_unit_ids: string[];
  related_post_ids: string[];
}

export type BlogEditorSection = 
  | "general"
  | "content"
  | "seo"
  | "relations"
  | "publishing";
