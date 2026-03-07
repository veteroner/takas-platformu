// Test Supabase JS query (same as what the frontend uses)
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rraatgwihvrxopjahpoh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyYWF0Z3dpaHZyeG9wamFocG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ3NzcsImV4cCI6MjA3NTE3MDc3N30.2373lOTqwczxUFKNG6Tqu6A_VyxFirkOrhheQMmzIcI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

(async () => {
  console.log('Testing Supabase JS client query...');
  console.log('URL:', supabaseUrl);
  
  const { data, error, count } = await supabase
    .from('items')
    .select(`
      *,
      owner:users!owner_id (
        id, name, first_name, last_name, display_name, avatar, rating, total_trades, location
      )
    `, { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('Supabase error:', error);
  } else {
    console.log('Total items returned:', data?.length);
    console.log('Exact count:', count);
    if (data && data.length > 0) {
      console.log('First item:', data[0].title);
      console.log('Last item:', data[data.length - 1].title);
    }
  }
})();
