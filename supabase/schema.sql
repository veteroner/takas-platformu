-- Takas Platform Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  rating DECIMAL(3,2) DEFAULT 0,
  total_trades INTEGER DEFAULT 0
);

-- Items table
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('clothing', 'toys', 'electronics', 'books', 'sports', 'home', 'other')),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like-new', 'good', 'fair', 'poor')),
  estimated_value INTEGER,
  images TEXT[] NOT NULL DEFAULT '{}',
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'traded', 'deleted')),
  location TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0
);

-- Swipes table (tracks user swipes)
CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('left', 'right')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Matches table (when two users swipe right on each other's items)
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item1_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  item2_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (user1_id < user2_id) -- Ensure unique match pair
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX idx_items_owner_id ON public.items(owner_id);
CREATE INDEX idx_items_status ON public.items(status);
CREATE INDEX idx_items_category ON public.items(category);
CREATE INDEX idx_items_created_at ON public.items(created_at DESC);
CREATE INDEX idx_swipes_user_id ON public.swipes(user_id);
CREATE INDEX idx_swipes_item_id ON public.swipes(item_id);
CREATE INDEX idx_matches_users ON public.matches(user1_id, user2_id);
CREATE INDEX idx_messages_match_id ON public.messages(match_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Items policies
CREATE POLICY "Anyone can view active items" ON public.items FOR SELECT USING (status = 'active');
CREATE POLICY "Users can insert own items" ON public.items FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own items" ON public.items FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own items" ON public.items FOR DELETE USING (auth.uid() = owner_id);

-- Swipes policies
CREATE POLICY "Users can view own swipes" ON public.swipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own swipes" ON public.swipes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Users can view own matches" ON public.matches FOR SELECT 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "System can create matches" ON public.matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own matches" ON public.matches FOR UPDATE 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can insert own messages" ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE 
  USING (auth.uid() = receiver_id);

-- Functions

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check for matches after swipe
CREATE OR REPLACE FUNCTION public.check_for_match()
RETURNS TRIGGER AS $$
DECLARE
  other_item_id UUID;
  other_user_id UUID;
  match_exists BOOLEAN;
BEGIN
  -- Only process right swipes
  IF NEW.direction = 'right' THEN
    -- Get the item owner
    SELECT owner_id INTO other_user_id 
    FROM public.items 
    WHERE id = NEW.item_id;
    
    -- Check if other user has swiped right on any of current user's items
    SELECT EXISTS (
      SELECT 1 
      FROM public.swipes s
      INNER JOIN public.items i ON s.item_id = i.id
      WHERE s.user_id = other_user_id 
        AND s.direction = 'right'
        AND i.owner_id = NEW.user_id
    ) INTO match_exists;
    
    -- If match exists, create match record
    IF match_exists THEN
      -- Get the item that was swiped right
      SELECT s.item_id INTO other_item_id
      FROM public.swipes s
      INNER JOIN public.items i ON s.item_id = i.id
      WHERE s.user_id = other_user_id 
        AND s.direction = 'right'
        AND i.owner_id = NEW.user_id
      LIMIT 1;
      
      -- Create match (ensure user1_id < user2_id for uniqueness)
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

-- Trigger to check for matches
CREATE TRIGGER on_swipe_created
  AFTER INSERT ON public.swipes
  FOR EACH ROW EXECUTE FUNCTION public.check_for_match();

-- Function to update item view count
CREATE OR REPLACE FUNCTION public.increment_item_views(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.items 
  SET views = views + 1,
      updated_at = NOW()
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
