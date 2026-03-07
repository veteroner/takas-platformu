const { Client } = require('pg');
const CONNECTION = 'postgresql://postgres.rraatgwihvrxopjahpoh:Oner2621.%2C@aws-1-eu-north-1.pooler.supabase.com:5432/postgres';

// Simplified keyword list for checking which items fall through to category fallback
const KEYWORDS = [
  'hoodie','kapüşon','sweatshirt','deri ceket','blazer','trençkot','trench',
  'mont ','kışlık mont','kaban','palto','jean ','jean-','denim','kot pantolon',
  'gömlek','shirt','elbise','dress','şal','scarf','atkı','fular','tişört','t-shirt',
  'tayt','legging','kazak','hırka','triko','örgü','sweater','pantolon','chino',
  'ceket','jacket','sırt çantası','backpack','çanta','bag','handbag','bot ','boots',
  'çizme','bebek giyim','çocuk giyim','çocuk set','forma seti','forması',
  'ayakkabı','sneaker','air force','new balance','spor giyim','sporcu','spor sütyeni',
  'lego','barbie','bebek','oyuncak bebek','hot wheels','araba','oyuncak araba',
  'monopoly','kutu oyun','masa oyun','uno','risk','scrabble','yapboz','puzzle',
  'peluş','plush','rubik','küp','drone','dji','rc ','uzaktan kumanda','nerf',
  'bisiklet','bicycle','bike','blok','block','yapı','oyuncak','toy','play-doh','oyun matı',
  'airpods','earbuds','buds','tablet','ipad','speaker','hoparlör','jbl','bose','soundlink',
  'marshall','ps5','dualsense','gamepad','controller','oyun kolu',
  'smartwatch','akıllı saat','mi band','apple watch','kamera','camera','canon','nikon',
  'klavye','keyboard','keychron','mouse','fare','logitech','headphone','sony wh','kulaklık',
  'monitor','ekran','powerbank','batarya','anker','xbox','playstation','nintendo','switch','konsol',
  'kindle','e-okuyucu','instax','gopro','raspberry','pi','wifi','router','modem','gimbal',
  'oneblade','tıraş','telefon','iphone','samsung galaxy','xiaomi',
  'kitap seti','set kitap','koleksiyon','manga','çizgi roman','yemek kitab','mutfak kitab','tarif',
  'çocuk kitap','masal','ansiklopedi','sözlük','dictionary','defter','planner','journal','ajanda',
  'kpss','sınav','hazırlık','roman','novel','kitab','kitap','book','şiir','rehber',
  'yoga','mat','tenis','raket','tennis','kettlebell','dambıl','futbol','football','soccer',
  'çadır','kamp','camp','kask','helmet','direnç','resistance','band','basketbol','basketball',
  'koşu','running','yüzme','swimming','havuz','dağ bisiklet','mtb','boks','boxing','eldiven',
  'kayak','ski','scooter','e-scooter','pilates','reformer','trekking','çubuk',
  'halter','ağırlık','weight','uyku tulumu','sleeping','badminton','dalış','diving','şnorkel',
  'atlama','ip','jump rope','masa tenisi','ping pong','foam roller','roller','spor çantası','sport bag',
  'nevresim','yatak örtü','çarşaf','kitaplık','raf','bookshelf','hue','akıllı ışık','led lamba','lamba',
  'tencere','tava','cookware','le creuset','ayna','mirror','kahve makine','nespresso','espresso',
  'kilim','rug','süpürge','dyson','vacuum','bitki','çiçek','monstera','saksı','mum','candle',
  'koltuk','sandalye','chair','robot mutfak','arzum','mutfak robotu','sehpa','masa ','table',
  'hava temizle','air purifier','porselen','tabak','çanak','yemek seti',
  'düzenleyici','organizer','bambu','kırlent','yastık','cushion','türk kahve','cezve',
  'saat','duvar saat','clock','battaniye','blanket','moka','bialetti','french press',
  'halı','carpet','airfryer','fritöz','askı','kurutma',
  'güneş gözlüğ','ray-ban','sunglasses','ukulele','gitar','guitar','satranç','chess',
  'polaroid','cüzdan','wallet','çakı','victorinox','bıçak','teleskop','telescope',
  'boya','paint','resim','tuval','kamp lamba','vazo','seramik','kayış','strap','dürbün','binocular'
];

async function main() {
  const c = new Client({ connectionString: CONNECTION });
  await c.connect();
  
  const { rows } = await c.query('SELECT title, category FROM public.items ORDER BY category, title');
  
  const fallback = [];
  for (const item of rows) {
    const lower = item.title.toLowerCase();
    let matched = false;
    for (const kw of KEYWORDS) {
      if (lower.includes(kw.toLowerCase())) { matched = true; break; }
    }
    if (!matched) fallback.push(`[${item.category}] ${item.title}`);
  }
  
  console.log(`Items using category fallback (${fallback.length} of ${rows.length}):`);
  fallback.forEach(f => console.log('  ' + f));
  
  await c.end();
}

main().catch(console.error);
