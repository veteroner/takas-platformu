// Quick script to check Supabase Storage bucket
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rraatgwihvrxopjahpoh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyYWF0Z3dpaHZyeG9wamFocG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ3NzcsImV4cCI6MjA3NTE3MDc3N30.2373lOTqwczxUFKNG6Tqu6A_VyxFirkOrhheQMmzIcI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBucket() {
  console.log('🔍 Checking Supabase Storage...')
  
  // List all buckets
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  
  if (listError) {
    console.error('❌ Error listing buckets:', listError)
    return
  }
  
  console.log('\n📦 Available buckets:')
  buckets.forEach(bucket => {
    console.log(`  - ${bucket.name} (${bucket.public ? 'PUBLIC' : 'PRIVATE'})`)
  })
  
  // Check if item-images exists
  const itemImagesBucket = buckets.find(b => b.name === 'item-images')
  
  if (!itemImagesBucket) {
    console.log('\n❌ SORUN: "item-images" bucket bulunamadı!')
    console.log('\n✅ ÇÖZÜM:')
    console.log('1. https://supabase.com/dashboard → Project seç')
    console.log('2. Storage → Create bucket')
    console.log('3. Name: item-images')
    console.log('4. Public bucket: ✅ YES')
    console.log('5. File size limit: 5 MB')
    console.log('6. Allowed MIME types: image/*')
  } else {
    console.log(`\n✅ "item-images" bucket mevcut!`)
    console.log(`   Public: ${itemImagesBucket.public ? 'YES ✅' : 'NO ❌'}`)
    
    if (!itemImagesBucket.public) {
      console.log('\n⚠️  UYARI: Bucket private! Public yapmalısınız.')
    }
  }
}

checkBucket()
