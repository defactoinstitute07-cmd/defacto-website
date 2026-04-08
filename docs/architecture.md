# Production Architecture (as requested)

## 1) Users
- Browser users
- Mobile users
- Googlebot crawler

## 2) CDN / Edge Layer
- Cloudflare Free Tier
- Global caching for static assets
- WAF + rate limiting
- SSL + HTTP/3 (QUIC)

## 3) Hosting Layer
- Next.js App Router with SSG/ISR
- Deploy to Vercel (recommended) or Netlify
- GitHub-connected CI/CD

## 4) Backend Services
- Serverless API routes in Next.js (`app/api/*`)
- Algolia for search indexing/querying
- Formspree for form/email handling

## 5) Data Layer
- Supabase PostgreSQL as primary content/auth database
- Supabase Auth for admin login
- Cloudinary for media uploads and delivery CDN
- Optional headless CMS: Sanity or Contentful for expanded editorial workflows

## What is implemented in this project now
- Admin panel at `/admin`
- Admin login at `/admin/login` using Supabase Auth
- Content API at `/api/content` (GET/PUT)
- Cloudinary signed upload API at `/api/cloudinary-signature`
- Homepage reads managed content from Supabase with fallback defaults
- ISR revalidation after content updates

## Deployment checklist
1. Copy `.env.example` to `.env.local` and set all keys.
2. Run SQL from `supabase/schema.sql`.
3. Create at least one Supabase auth user for admin login.
4. Deploy on Vercel.
5. Put Cloudflare in front of your deployment domain and enable caching + WAF/rate limiting.
6. Add your domain in Search Console and submit sitemap.
