const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.rraatgwihvrxopjahpoh:Oner2621.%2C@aws-1-eu-north-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  console.log('Connected!');
  
  // Check auth.users columns
  const authCols = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'auth' AND table_name = 'users'
    ORDER BY ordinal_position
  `);
  console.log('\n=== auth.users columns ===');
  authCols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type}) nullable=${r.is_nullable} default=${r.column_default}`));
  
  // Check public.users columns
  const pubCols = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'users'
    ORDER BY ordinal_position
  `);
  console.log('\n=== public.users columns ===');
  pubCols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type}) nullable=${r.is_nullable} default=${r.column_default}`));
  
  // Check public.items columns
  const itemCols = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'items'
    ORDER BY ordinal_position
  `);
  console.log('\n=== public.items columns ===');
  itemCols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type}) nullable=${r.is_nullable} default=${r.column_default}`));
  
  // Check existing data counts
  const userCount = await client.query('SELECT count(*) FROM public.users');
  const itemCount = await client.query('SELECT count(*) FROM public.items');
  const authCount = await client.query('SELECT count(*) FROM auth.users');
  console.log('\n=== Existing data ===');
  console.log(`  auth.users: ${authCount.rows[0].count}`);
  console.log(`  public.users: ${userCount.rows[0].count}`);
  console.log(`  public.items: ${itemCount.rows[0].count}`);
  
  // Check if pgcrypto is available
  const ext = await client.query(`SELECT * FROM pg_extension WHERE extname = 'pgcrypto'`);
  console.log(`\n  pgcrypto extension: ${ext.rows.length > 0 ? 'YES' : 'NO'}`);
  
  // Check trigger exists
  const trigger = await client.query(`
    SELECT trigger_name FROM information_schema.triggers 
    WHERE event_object_table = 'users' AND trigger_schema = 'auth'
  `);
  console.log(`  auth triggers: ${trigger.rows.map(r => r.trigger_name).join(', ') || 'none'}`);
  
  await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
