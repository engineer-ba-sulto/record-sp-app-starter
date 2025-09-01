-- RLS Policy Template for System Meta Data Tables
-- This template provides Row Level Security policies for tables that contain system-wide metadata
-- These tables should be read-only for authenticated users and fully controlled by service role

-- Enable RLS on the table
alter table public.{table_name} enable row level security;

-- Policy for selecting (read-only access for authenticated users)
create policy "allow select {table_name}" on public.{table_name}
  for select
  to authenticated
  using (true);

-- Policy for inserting (only service role should insert)
create policy "allow insert {table_name}" on public.{table_name}
  for insert
  to service_role
  with check (true);

-- Policy for updating (only service role should update)
create policy "allow update {table_name}" on public.{table_name}
  for update
  to service_role
  using (true)
  with check (true);

-- Policy for deleting (only service role should delete)
create policy "allow delete {table_name}" on public.{table_name}
  for delete
  to service_role
  using (true);

-- Usage Instructions:
-- 1. Replace {table_name} with your actual table name
-- 2. This template is for system-wide metadata tables (not user-specific data)
-- 3. Authenticated users can only read the data
-- 4. Only service role can insert, update, or delete data
-- 5. Use this for configuration tables, app settings, etc.
