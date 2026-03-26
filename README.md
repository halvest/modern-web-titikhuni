# 🏠 Titik Huni Database Schema (Production Ready)

Dokumentasi ini berisi panduan lengkap mengenai struktur database PostgreSQL di Supabase untuk proyek **Titik Huni**. Schema ini dirancang untuk mendukung fitur katalog properti, blog SEO, dan pelacakan _leads_ marketing dari Meta Ads.

## 📌 Fitur Utama

- **Enum Safety**: Mencegah kesalahan input status (Draft, Published, Tersedia, dll).
- **Media Gallery**: Mendukung banyak foto per properti.
- **Marketing & Ads Ready**: Tabel khusus untuk menampung data calon pembeli (_leads_).
- **SEO Optimized**: Indexing pada slug dan sistem kategori/tagging.
- **Security**: Menggunakan Row Level Security (RLS) untuk memisahkan akses publik dan admin.

---

## 🛠️ Instalasi (SQL Editor)

Jalankan perintah berikut di SQL Editor Supabase secara berurutan:

### 1. Extensions & Types

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Status untuk Blog
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');

-- Status untuk Unit Properti
CREATE TYPE unit_status AS ENUM ('Tersedia', 'Sold', 'Booked', 'Coming Soon');
```

### 2. Tabel Master

```sql
-- Tabel Kategori (Post & Unit)
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    type text NOT NULL CHECK (type IN ('post', 'unit')),
    description text,
    created_at timestamptz DEFAULT now()
);

-- Tabel Tags (SEO)
CREATE TABLE public.tags (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text NOT NULL UNIQUE
);
```

### 3. Tabel Core (Units & Posts)

```sql
-- Tabel Katalog Properti
CREATE TABLE public.units (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    location text NOT NULL,
    price bigint NOT NULL,
    status unit_status DEFAULT 'Tersedia',
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    description text,
    bedroom_count integer DEFAULT 0,
    bathroom_count integer DEFAULT 0,
    land_area integer DEFAULT 0,
    building_area integer DEFAULT 0,
    priority_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

-- Tabel Blog
CREATE TABLE public.posts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    content text NOT NULL,
    excerpt text,
    featured_image text,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    status post_status DEFAULT 'draft',
    views integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);
```

### 4. Tabel Relasi & Marketing

```sql
-- Gallery Foto Properti
CREATE TABLE public.unit_images (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id uuid REFERENCES public.units(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    is_primary boolean DEFAULT false
);

-- Leads (Data Calon Pembeli)
CREATE TABLE public.leads (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    phone text NOT NULL,
    email text,
    message text,
    unit_id uuid REFERENCES public.units(id) ON DELETE SET NULL,
    source text DEFAULT 'organic', -- misal: 'meta_ads', 'tiktok'
    created_at timestamptz DEFAULT now()
);
```

---

## 🔐 Keamanan (Row Level Security)

Secara default, jalankan perintah ini agar data aman:

1.  **Aktifkan RLS**:

    ```sql
    ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
    ```

2.  **Akses Publik (Read Only)**:

    ```sql
    CREATE POLICY "Public view units" ON public.units FOR SELECT USING (deleted_at IS NULL);
    CREATE POLICY "Public view posts" ON public.posts FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
    ```

3.  **Akses Admin (Full Access)**:
    ```sql
    -- Hanya user terautentikasi (admin) yang bisa melakukan perubahan
    CREATE POLICY "Admins manage units" ON public.units FOR ALL TO authenticated USING (true);
    ```

---

## 📈 Indeks Performa

Gunakan indeks ini untuk memastikan filter harga dan pencarian slug tetap instan:

```sql
CREATE INDEX idx_units_price ON public.units(price);
CREATE INDEX idx_units_slug ON public.units(slug);
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
```

---

## 💡 Tips Integrasi Next.js

Saat melakukan fetching data di komponen `Unit.tsx`, pastikan kamu mengambil data relasi kategorinya juga:

```typescript
const { data, error } = await supabase
  .from("units")
  .select("*, categories(name)") // Join dengan tabel kategori
  .is("deleted_at", null)
  .order("priority_order", { ascending: true });
```
