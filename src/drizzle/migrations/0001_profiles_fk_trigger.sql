-- Add FK constraint to auth.users and trigger for updated_at
-- Note: Run this after 0000_*.sql is applied

alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on public.profiles;
create trigger trg_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
