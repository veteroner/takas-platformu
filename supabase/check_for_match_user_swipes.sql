-- Create trigger/function to detect matches when using `user_swipes` table
-- This mirrors the existing logic on `swipes` but maps `action = 'like'` to a right swipe
CREATE OR REPLACE FUNCTION public.check_for_match_user_swipes()
RETURNS TRIGGER AS $$
DECLARE
  other_item_id UUID;
  other_user_id UUID;
  match_exists BOOLEAN;
BEGIN
  -- Only process likes
  IF NEW.action = 'like' THEN
    -- Get the item owner
    SELECT owner_id INTO other_user_id
    FROM public.items
    WHERE id = NEW.item_id;

    -- Check if other user has liked any of current user's items
    SELECT EXISTS (
      SELECT 1
      FROM public.user_swipes s
      INNER JOIN public.items i ON s.item_id = i.id
      WHERE s.user_id = other_user_id
        AND s.action = 'like'
        AND i.owner_id = NEW.user_id
    ) INTO match_exists;

    IF match_exists THEN
      -- Get the other item id that created the reciprocal like
      SELECT s.item_id INTO other_item_id
      FROM public.user_swipes s
      INNER JOIN public.items i ON s.item_id = i.id
      WHERE s.user_id = other_user_id
        AND s.action = 'like'
        AND i.owner_id = NEW.user_id
      LIMIT 1;

      -- Insert into matches (ensure uniqueness by ordering user ids)
      INSERT INTO public.matches (user1_id, user2_id, item1_id, item2_id)
      VALUES (
        LEAST(NEW.user_id, other_user_id),
        GREATEST(NEW.user_id, other_user_id),
        CASE WHEN NEW.user_id < other_user_id THEN other_item_id ELSE NEW.item_id END,
        CASE WHEN NEW.user_id < other_user_id THEN NEW.item_id ELSE other_item_id END
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on user_swipes
DROP TRIGGER IF EXISTS on_user_swipe_created ON public.user_swipes;
CREATE TRIGGER on_user_swipe_created
  AFTER INSERT ON public.user_swipes
  FOR EACH ROW EXECUTE FUNCTION public.check_for_match_user_swipes();

SELECT '✅ check_for_match_user_swipes installed' as status;
