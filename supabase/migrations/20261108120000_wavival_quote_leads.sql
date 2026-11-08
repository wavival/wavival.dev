-- wavival.dev quote leads in the shared public.leads table of the Supabase
-- project db-luminaw-terracore-okroot-pages. The table is shared with
-- TerraCore, OKroot and Lumina W, so every change here is additive or scoped to
-- product = 'wavival'. The `stage` column belongs to Lumina W and is untouched.
--
-- Applied through the Supabase MCP (`apply_migration`, name
-- wavival_quote_leads) after the owner confirmed this exact text.

begin;

-- 1. wavival becomes a valid product.
alter table public.leads drop constraint leads_product_check;
alter table public.leads
  add constraint leads_product_check
  check (product = any (array['terracore'::text, 'okroot'::text, 'luminaw'::text, 'wavival'::text]));

-- 2. One row per quote for wavival; the other products keep one row per email.
alter table public.leads drop constraint leads_product_email_key;
create unique index leads_product_email_unique_idx
  on public.leads (product, email)
  where product <> 'wavival';

-- 3. Quote fields. All optional or with a default, so existing rows stay valid.
alter table public.leads
  add column services text[],
  add column country text check (country ~ '^[A-Z]{2}$'),
  add column geo_country text,
  add column budget_range text,
  add column currency text check (currency in ('COP', 'USD')),
  add column how_found text,
  add column preferred_channel text,
  add column timeline text,
  add column status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  add column contacted_at timestamptz,
  add column notes text;

-- 4. Listing and follow-up queries per product.
create index leads_product_created_at_idx on public.leads (product, created_at desc);
create index leads_product_status_idx on public.leads (product, status);

-- 5. Only the service role, from the server, reads or writes leads.
alter table public.leads enable row level security;
revoke all on table public.leads from anon, authenticated;

commit;
