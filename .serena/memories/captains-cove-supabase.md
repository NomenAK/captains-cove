# Captain's Cove Supabase Configuration

## Project
- **URL**: `https://lewslcexldrbequixxpg.supabase.co`
- **Project Ref**: `lewslcexldrbequixxpg`

## Keys
- **Anon Key** (client-safe): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxld3NsY2V4bGRyYmVxdWl4eHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNDQ5NzIsImV4cCI6MjA4MTYyMDk3Mn0.gx0PMcALLMMpTLTdlrOMakXK3iexrSGo6nCbmX2dAK0`
- **Service Role Key** (seeding only, never expose): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxld3NsY2V4bGRyYmVxdWl4eHBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0NDk3MiwiZXhwIjoyMDgxNjIwOTcyfQ.NbfBfwAVoW9tb1L5FsFW7Rn7e_7jzRFQxwUXRsDW9EU`

## Tables
| Table | PK Type | Records |
|-------|---------|---------|
| ships | INTEGER | 71 |
| weapons | TEXT | 42 |
| ammo | TEXT | 14 |
| kegs | TEXT | 6 |
| crews | TEXT | 55 |
| skills | TEXT | 53 |
| upgrades | TEXT | - |
| cosmetics | TEXT | - |
| resources | TEXT | - |
| localization | TEXT | 5419 |
| builds | UUID | user-created |

## RLS Policies
- **All tables**: Public SELECT (read access)
- **builds only**: Public INSERT, UPDATE, DELETE (anonymous CRUD)

## Commands
```bash
# Seed database (requires SUPABASE_SERVICE_KEY)
SUPABASE_SERVICE_KEY=xxx npm run seed

# Link project
supabase link --project-ref lewslcexldrbequixxpg

# Push migrations
supabase db push
```

## Schema Files
- `supabase/schema.sql` - Full schema (reference)
- `supabase/migrations/` - Migration files for `supabase db push`
