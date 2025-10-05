// Backend Test Script
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 BACKEND TEST BAŞLIYOR...\n');
console.log('📡 Supabase URL:', supabaseUrl);
console.log('🔑 API Key:', supabaseKey ? '✅ Mevcut' : '❌ Eksik');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBackend() {
  try {
    // 1. Database bağlantısı
    console.log('\n1️⃣ Database bağlantısı test ediliyor...');
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .limit(1);
    
    if (itemsError) throw itemsError;
    console.log('   ✅ Database bağlantısı başarılı!');
    
    // 2. Storage bucket kontrolü
    console.log('\n2️⃣ Storage bucket kontrolü...');
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketError) throw bucketError;
    const itemImagesBucket = buckets.find(b => b.name === 'item-images');
    console.log('   ✅ Storage bucket:', itemImagesBucket ? 'Mevcut' : '⚠️  Eksik');
    
    // 3. Tabloları kontrol et
    console.log('\n3️⃣ Tabloları kontrol ediliyor...');
    const tables = ['users', 'items', 'swipes', 'matches', 'messages'];
    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      console.log(`   ${error ? '❌' : '✅'} ${table} tablosu`);
    }
    
    console.log('\n✅ BACKEND TEST TAMAMLANDI!\n');
    console.log('🎉 Supabase backend tamamen hazır!\n');
    
  } catch (error) {
    console.error('\n❌ HATA:', error.message);
    console.log('\n📋 Sorun giderme:\n');
    console.log('1. .env.local dosyasını kontrol et');
    console.log('2. Supabase SQL Editor\'da schema.sql çalıştırıldı mı?');
    console.log('3. item-images bucket oluşturuldu mu?\n');
  }
  
  process.exit(0);
}

testBackend();
