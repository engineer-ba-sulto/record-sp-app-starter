-- RLS Policy Template for User Data Tables
-- This template provides Row Level Security policies for tables that contain user-specific data
-- Apply this template to any table that has a user_id column and should be restricted to user ownership

-- Enable RLS on the table
alter table public.{table_name} enable row level security;

-- Policy for selecting own rows only
create policy "allow select own rows" on public.{table_name}
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Policy for inserting as self only
create policy "allow insert as self" on public.{table_name}
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- Policy for updating own rows only
create policy "allow update own rows" on public.{table_name}
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Policy for deleting own rows only (optional - remove if delete should not be allowed)
create policy "allow delete own rows" on public.{table_name}
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Recommended index for user_id column (improves RLS performance)
create index if not exists {table_name}_user_id_idx
  on public.{table_name} using btree(user_id);

-- Usage Instructions:
-- 1. Replace {table_name} with your actual table name
-- 2. Ensure your table has a user_id column of type uuid
-- 3. The user_id column should reference auth.users.id
-- 4. Remove the delete policy if users should not be able to delete their data
-- 5. Test the policies with multiple users to ensure isolation
