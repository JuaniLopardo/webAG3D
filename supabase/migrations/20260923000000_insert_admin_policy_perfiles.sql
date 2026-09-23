CREATE POLICY "insert_admin" ON public.perfiles FOR INSERT WITH CHECK (public.is_admin());
