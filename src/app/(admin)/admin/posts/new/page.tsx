"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Heading2,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { savePost, updatePost } from "../actions"; 

// TipTap Imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

export default function PostFormPage({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const isEdit = !!params?.id;

  // States
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [categories, setCategories] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: "",
    category_id: "",
    status: "draft",
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Tuliskan cerita atau informasi properti Anda di sini...",
      }),
    ],
    content: formData.content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none focus:outline-none min-h-[500px] p-8 text-lg leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Fetching Data
  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data);
  };

  useEffect(() => {
    const init = async () => {
      await fetchCategories();
      if (isEdit) {
        const { data } = await supabase
          .from("posts")
          .select("*")
          .eq("id", params?.id)
          .single();
        if (data) {
          setFormData(data);
          editor?.commands.setContent(data.content);
        }
        setFetching(false);
      }
    };
    init();
  }, [isEdit, params?.id, editor]);

  // Helpers
  const generateSlug = (text: string) => {
    const slug = text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
    setFormData((prev) => ({ ...prev, title: text, slug }));
  };

  const handleAddCategory = async () => {
    if (!newCatName) return;
    const slug = newCatName.toLowerCase().replace(/ /g, "-");
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: newCatName, slug }])
      .select();

    if (error) {
      toast.error("Kategori sudah ada atau gagal dibuat.");
    } else {
      toast.success("Kategori ditambahkan!");
      await fetchCategories();
      setFormData({ ...formData, category_id: data[0].id });
      setNewCatName("");
      setShowCatModal(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "featured" | "editor",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    try {
      const { error: uploadError } = await supabase.storage
        .from("blog")
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage.from("blog").getPublicUrl(fileName);

      if (field === "featured")
        setFormData((prev) => ({ ...prev, featured_image: publicUrl }));
      else editor?.chain().focus().setImage({ src: publicUrl }).run();
      toast.success("Gambar berhasil diunggah.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));

    try {
      const result = isEdit
        ? await updatePost(params!.id, data)
        : await savePost(data);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Berhasil disimpan!");
        if (isEdit) router.push("/admin/posts");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-screen flex items-center justify-center font-bold tracking-tighter text-2xl animate-pulse">
        LOADING...
      </div>
    );

  return (
    <div className="bg-white min-h-screen pb-20">
      <Toaster />

      {/* Top Floating Nav */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex justify-between items-center">
        <Link
          href="/admin/posts"
          className="flex items-center gap-2 text-neutral-400 hover:text-black transition-all"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Drafts
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase text-neutral-300 tracking-[0.3em]">
            {isEdit ? "Editing Mode" : "New Entry"}
          </span>
          <button
            onClick={handleSubmit}
            disabled={loading || isUploading}
            className="bg-black text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2 disabled:opacity-30"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {isEdit ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto mt-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-16"
      >
        {/* Editor Area */}
        <div className="lg:col-span-8 space-y-8">
          <input
            required
            type="text"
            value={formData.title}
            onChange={(e) => generateSlug(e.target.value)}
            className="w-full text-6xl font-black tracking-tighter outline-none placeholder:text-neutral-100"
            placeholder="Type your title..."
          />

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-50 rounded-2xl w-fit border border-neutral-100 sticky top-24 z-20">
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBold().run()}
              active={editor?.isActive("bold")}
              icon={<Bold size={16} />}
            />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              active={editor?.isActive("italic")}
              icon={<Italic size={16} />}
            />
            <ToolbarButton
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={editor?.isActive("heading", { level: 2 })}
              icon={<Heading2 size={16} />}
            />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              active={editor?.isActive("bulletList")}
              icon={<List size={16} />}
            />
            <div className="w-px h-4 bg-neutral-200 mx-2" />
            <label className="p-2 hover:bg-white rounded-xl cursor-pointer transition-all flex items-center gap-2 text-neutral-400 hover:text-black">
              <ImageIcon size={16} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "editor")}
              />
            </label>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-2xl shadow-neutral-100">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Settings Area */}
        <div className="lg:col-span-4 space-y-10">
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">
              Thumbnail
            </h3>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-50 border-2 border-dashed border-neutral-100 group hover:border-black transition-all">
              {formData.featured_image ? (
                <img
                  src={formData.featured_image}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-300 group-hover:text-black">
                  <Plus size={32} strokeWidth={3} />
                </div>
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "featured")}
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">
                Category
              </h3>
              <button
                type="button"
                onClick={() => setShowCatModal(true)}
                className="text-black hover:scale-110 transition-transform"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
            <select
              required
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none font-bold text-sm appearance-none cursor-pointer"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">
              Meta Description
            </h3>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none text-xs font-medium h-32 resize-none"
              placeholder="Brief summary for SEO..."
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">
              Status
            </h3>
            <div className="flex p-1 bg-neutral-50 rounded-2xl border border-neutral-100">
              {["draft", "published"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s })}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    formData.status === s
                      ? "bg-white shadow-sm text-black"
                      : "text-neutral-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        </div>
      </form>

      {/* Quick Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase tracking-tighter">
                Add <span className="text-neutral-300">Category</span>
              </h2>
              <button onClick={() => setShowCatModal(false)}>
                <X size={20} />
              </button>
            </div>
            <input
              autoFocus
              type="text"
              placeholder="Category Name"
              className="w-full p-5 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none font-bold mb-6"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarButton({ onClick, active, icon }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-xl transition-all ${
        active
          ? "bg-white text-black shadow-sm"
          : "text-neutral-400 hover:text-black"
      }`}
    >
      {icon}
    </button>
  );
}
