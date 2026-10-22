import React, { type ReactNode, useCallback, useState } from "react";
import { PostFormData } from "../types";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { 
  Bold, Italic, List, ListOrdered, Quote, 
  Heading2, ImageIcon, Link as LinkIcon, 
  Undo, Redo 
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { compressImage } from "@/lib/images/compress-image";

const supabase = createClient();

interface TipTapSectionProps {
  data: PostFormData;
  onChange: (updates: Partial<PostFormData>) => void;
}

export function TipTapSection({ data, onChange }: TipTapSectionProps) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ 
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder: "Tulis isi artikel di sini...",
      }),
    ],
    content: data.content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none focus:outline-none min-h-[600px] p-8 text-lg leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      // Send raw HTML to parent. Sanitization happens on the server (actions.ts).
      onChange({ content: editor.getHTML() });
    },
  });

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type) || file.size > 15 * 1024 * 1024) {
      toast.error("Gunakan JPG, PNG, WebP, atau AVIF maksimal 15 MB.");
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Mengompresi dan menyisipkan gambar...");

    try {
      const fileToUpload = await compressImage(file);
      const fileName = `content-${Date.now()}-${fileToUpload.name.replace(/[^a-zA-Z0-9.\-]/g, "")}`;
      const { error } = await supabase.storage.from("blog").upload(fileName, fileToUpload, {
        contentType: fileToUpload.type,
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from("blog").getPublicUrl(fileName);
      editor.chain().focus().setImage({ src: publicUrl }).run();
      toast.success("Gambar berhasil disisipkan.", { id: toastId });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gambar gagal diunggah.", { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Masukkan URL tautan', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    try {
      // Basic validation
      new URL(url.startsWith('http') ? url : `https://${url}`);
      const normalizedUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      editor.chain().focus().extendMarkRange('link').setLink({ href: normalizedUrl }).run();
    } catch (e) {
      toast.error("Format URL tidak valid.");
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="h-[600px] bg-slate-50 animate-pulse rounded-2xl border border-slate-200 flex items-center justify-center">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Memuat editor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Isi Artikel
        </h2>
        <p className="mt-1.5 text-[13px] font-medium text-slate-500">
          Tulis dan format konten menggunakan editor rich text.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-3 bg-slate-50 border-b border-slate-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            icon={<Heading2 size={16} />}
            tooltip="Heading 2"
          />
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            icon={<Bold size={16} />}
            tooltip="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            icon={<Italic size={16} />}
            tooltip="Italic"
          />
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            icon={<List size={16} />}
            tooltip="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            icon={<ListOrdered size={16} />}
            tooltip="Ordered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            icon={<Quote size={16} />}
            tooltip="Quote"
          />
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <ToolbarButton
            onClick={setLink}
            active={editor.isActive("link")}
            icon={<LinkIcon size={16} />}
            tooltip="Insert Link"
          />
          <label className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white transition-all cursor-pointer relative group">
            <ImageIcon size={16} />
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
          <div className="flex-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            active={false}
            icon={<Undo size={16} />}
            tooltip="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            active={false}
            icon={<Redo size={16} />}
            tooltip="Redo"
          />
        </div>

        {/* Editor */}
        <div className="max-w-4xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, active, icon, tooltip }: { onClick: () => void; active: boolean; icon: ReactNode; tooltip: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      aria-label={tooltip}
      className={`p-2 rounded-xl transition-all ${
        active
          ? "bg-white text-slate-900 shadow-sm font-bold border border-slate-200/60"
          : "text-slate-500 hover:text-slate-900 hover:bg-white"
      }`}
    >
      {icon}
    </button>
  );
}
