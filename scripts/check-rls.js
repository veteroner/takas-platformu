const { Client } = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres.rraatgwihvrxopjahpoh:Oner2621.%2C@aws-1-eu-north-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

(async () => {
  await c.connect();
  
  const r1 = await c.query("SELECT relrowsecurity FROM pg_class WHERE relname='users'");
  console.log('Users RLS:', r1.rows[0]);
  
  const r2 = await c.query("SELECT policyname,cmd,qual FROM pg_policies WHERE tablename='users'");
  console.log('Users Policies:', JSON.stringify(r2.rows, null, 2));
  
  const r3 = await c.query("SELECT COUNT(*) FROM users");
  console.log('Total users:', r3.rows[0].count);
  
  const r4 = await c.query("SELECT COUNT(*) FROM items i JOIN users u ON i.owner_id=u.id WHERE i.status='active'");
  console.log('Items with valid owner:', r4.rows[0].count);

  const r5 = await c.query("SELECT COUNT(*) FROM items WHERE status='active' AND owner_id NOT IN (SELECT id FROM users)");
  console.log('Orphan items (no matching user):', r5.rows[0].count);
  
  await c.end();
})().catch(e => { console.error(e); process.exit(1); });
