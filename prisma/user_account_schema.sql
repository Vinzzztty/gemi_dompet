-- SQL Schema untuk table user_account
-- Database: gemi_dompet_db
-- Schema: public

CREATE TABLE IF NOT EXISTS public.user_account (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_user_account_email ON public.user_account(email);

-- Add comment for documentation
COMMENT ON TABLE public.user_account IS 'User authentication and profile data';
COMMENT ON COLUMN public.user_account.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN public.user_account.email IS 'User email address (used for login)';
COMMENT ON COLUMN public.user_account.password IS 'Hashed password (bcrypt)';
COMMENT ON COLUMN public.user_account.full_name IS 'User full name';
COMMENT ON COLUMN public.user_account.created_at IS 'Account creation timestamp';
COMMENT ON COLUMN public.user_account.updated_at IS 'Last update timestamp';
