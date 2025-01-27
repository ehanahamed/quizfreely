ALTER TABLE public.studysets
DROP CONSTRAINT studysets_user_id_fkey;
ALTER TABLE public.studysets
ADD CONSTRAINT studysets_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id)
ON DELETE SET NULL;
