-- RLS Policy Test Queries
-- These queries can be used to test that RLS policies are working correctly
-- Run these queries as different authenticated users to verify isolation
-- Test 1: Check if user can select their own profile
-- Expected: Should return user's own profile only
SELECT
	*
FROM
	public.profiles
WHERE
	user_id = auth.uid ();

-- Test 2: Check if user can select all profiles (should be filtered by RLS)
-- Expected: Should only return user's own profile, even though no WHERE clause
SELECT
	*
FROM
	public.profiles;

-- Test 3: Try to insert a profile for another user (should fail)
-- Expected: Should fail with permission denied
-- INSERT INTO public.profiles (username, user_id) VALUES ('test_user', '00000000-0000-0000-0000-000000000000');
-- Test 4: Try to update another user's profile (should fail)
-- Expected: Should fail with permission denied
-- UPDATE public.profiles SET username = 'hacked' WHERE user_id != auth.uid();
-- Test 5: Try to delete another user's profile (should fail)
-- Expected: Should fail with permission denied
-- DELETE FROM public.profiles WHERE user_id != auth.uid();
-- Test 6: Check app_meta access (should be read-only for authenticated users)
-- Expected: Should be able to read but not modify
SELECT
	*
FROM
	public.app_meta;

-- Test 7: Try to insert into app_meta as authenticated user (should fail)
-- Expected: Should fail with permission denied
-- INSERT INTO public.app_meta (key, value) VALUES ('test_key', '{"test": "value"}');
-- Usage Instructions:
-- 1. Run these queries as different authenticated users
-- 2. Verify that users can only access their own data
-- 3. Verify that users cannot access other users' data
-- 4. Verify that app_meta is read-only for authenticated users
-- 5. Uncomment the failing queries to test that they actually fail