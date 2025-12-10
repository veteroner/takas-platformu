/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// Supabase Edge Function: Admin 2FA OTP E-posta Gönderimi
// Deploy: supabase functions deploy send-admin-otp
// Bu dosya Deno runtime'da çalışır, TypeScript hataları ignore edilebilir

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@takazone.com'
const APP_NAME = 'TakaZone'

interface OTPRequest {
  email: string
  code: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Auth kontrolü
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { email, code } = await req.json() as OTPRequest

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email and code required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Resend API ile e-posta gönder
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${APP_NAME} <${FROM_EMAIL}>`,
        to: [email],
        subject: `🔐 ${APP_NAME} Admin Doğrulama Kodu`,
        html: generateEmailHTML(code),
        text: generateEmailText(code),
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      console.error('Resend API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await emailResponse.json()
    
    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateEmailHTML(code: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Doğrulama Kodu</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 480px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="width: 64px; height: 64px; margin: 0 auto 20px; background: linear-gradient(135deg, #ec4899, #8b5cf6); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px;">🔐</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #18181b;">
                Admin Doğrulama Kodu
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #52525b; text-align: center;">
                Admin paneline erişmek için aşağıdaki 6 haneli kodu kullanın:
              </p>
              
              <!-- Code Box -->
              <div style="background: linear-gradient(135deg, #fdf4ff, #f3e8ff); border: 2px solid #e9d5ff; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: 'SF Mono', Monaco, 'Courier New', monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #7c3aed;">
                  ${code}
                </span>
              </div>
              
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #71717a; text-align: center;">
                ⏱️ Bu kod <strong>5 dakika</strong> içinde geçerliliğini yitirecektir.
              </p>
            </td>
          </tr>
          
          <!-- Warning -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #92400e;">
                  ⚠️ <strong>Güvenlik Uyarısı:</strong> Bu kodu kimseyle paylaşmayın. TakaZone ekibi sizden asla doğrulama kodu istemez.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 16px 16px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 12px; color: #a1a1aa; text-align: center;">
                Bu e-posta ${new Date().toLocaleString('tr-TR')} tarihinde admin girişi talebi üzerine gönderilmiştir.
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #a1a1aa; text-align: center;">
                © ${new Date().getFullYear()} TakaZone - TEKNOVA LTD. ŞTİ.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

function generateEmailText(code: string): string {
  return `
TakaZone Admin Doğrulama Kodu

Admin paneline erişmek için aşağıdaki 6 haneli kodu kullanın:

${code}

Bu kod 5 dakika içinde geçerliliğini yitirecektir.

⚠️ Güvenlik Uyarısı: Bu kodu kimseyle paylaşmayın. TakaZone ekibi sizden asla doğrulama kodu istemez.

---
Bu e-posta ${new Date().toLocaleString('tr-TR')} tarihinde admin girişi talebi üzerine gönderilmiştir.
© ${new Date().getFullYear()} TakaZone - TEKNOVA LTD. ŞTİ.
  `.trim()
}
