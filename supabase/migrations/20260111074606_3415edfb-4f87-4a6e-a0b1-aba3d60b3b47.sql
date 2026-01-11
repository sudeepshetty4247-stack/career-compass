-- Add documentation comment to handle_new_user function for security awareness
-- This function uses SECURITY DEFINER which is necessary but requires careful handling

COMMENT ON FUNCTION public.handle_new_user() IS 
  'SECURITY WARNING: This function uses SECURITY DEFINER and bypasses RLS policies. '
  'It automatically creates a user profile on signup by inserting into profiles table. '
  'Only touches the authenticated user''s own record (NEW.id from auth.users trigger). '
  'DO NOT MODIFY without security review. Keep function logic minimal and auditable.';