const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.rraatgwihvrxopjahpoh:Oner2621.%2C@aws-1-eu-north-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  
  // Check actual FK constraints on items table
  const fks = await client.query(`
    SELECT 
      tc.constraint_name,
      kcu.column_name,
      ccu.table_schema AS foreign_table_schema,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_name = 'items'
  `);
  console.log('Items FK constraints:');
  fks.rows.forEach(r => console.log(`  ${r.constraint_name}: ${r.column_name} -> ${r.foreign_table_schema}.${r.foreign_table_name}(${r.foreign_column_name})`));
  
  // Check how many users are in public.users now
  const pubCount = await client.query('SELECT count(*) FROM public.users');
  const authCount = await client.query('SELECT count(*) FROM auth.users');
  console.log(`\nauth.users: ${authCount.rows[0].count}`);
  console.log(`public.users: ${pubCount.rows[0].count}`);
  
  // Check new users exist in public.users
  const newUsers = await client.query(`
    SELECT id, email, name FROM public.users 
    WHERE email LIKE '%@takazone.com' 
    LIMIT 5
  `);
  console.log('\nSample new users in public.users:');
  newUsers.rows.forEach(r => console.log(`  ${r.id} - ${r.email} - ${r.name}`));

  // Check if profiles table exists and references
  const profiles = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'profiles'
  `);
  console.log(`\nprofiles table exists: ${profiles.rows.length > 0}`);
  
  await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
