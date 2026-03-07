const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.rraatgwihvrxopjahpoh:Oner2621.%2C@aws-1-eu-north-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  const filterTitles = process.argv.slice(2);

  await client.connect();

  const { rows } = await client.query(
    "SELECT title, category, images[1] AS image FROM public.items WHERE status = 'active' ORDER BY category, title"
  );

  const filteredRows = filterTitles.length > 0
    ? rows.filter((row) => filterTitles.includes(row.title))
    : rows;

  console.log(JSON.stringify(filteredRows, null, 2));

  await client.end();
}

main().catch(async (error) => {
  console.error(error);
  try {
    await client.end();
  } catch {}
  process.exit(1);
});