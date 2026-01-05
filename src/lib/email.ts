import { Resend } from 'resend'

// Resend API key - .env.local'den alınacak
const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@takazone.com'
const APP_NAME = 'TakaZone'

/**
 * Email doğrulama kodu gönder
 */
export async function sendVerificationEmail(
  email: string,
  verificationCode: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Email Adresinizi Doğrulayın 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px;
                border-radius: 16px;
                color: white;
              }
              .code-box {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin: 30px 0;
                border: 2px solid rgba(255, 255, 255, 0.3);
              }
              .code {
                font-size: 48px;
                font-weight: bold;
                letter-spacing: 8px;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.3);
                font-size: 14px;
                opacity: 0.9;
              }
              h1 {
                margin: 0 0 20px 0;
                font-size: 28px;
              }
              p {
                margin: 10px 0;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🎉 Hoş Geldiniz!</h1>
              <p>TakaZone'a kayıt olduğunuz için teşekkürler!</p>
              <p>Email adresinizi doğrulamak için aşağıdaki kodu kullanın:</p>
              
              <div class="code-box">
                <div class="code">${verificationCode}</div>
              </div>
              
              <p>Bu kod 15 dakika boyunca geçerlidir.</p>
              
              <div class="footer">
                <p>Eğer bu kaydı siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
                <p>Sevgilerle,<br><strong>TakaZone Ekibi</strong></p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email send error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

/**
 * Hoş geldin emaili gönder
 */
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `${name}, TakaZone'a Hoş Geldin! 🎊`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                padding: 40px;
                border-radius: 16px;
                color: white;
              }
              .content {
                background: white;
                color: #333;
                padding: 30px;
                border-radius: 12px;
                margin: 20px 0;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 40px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                margin: 20px 0;
              }
              h1 {
                margin: 0 0 20px 0;
                font-size: 32px;
              }
              ul {
                text-align: left;
                margin: 20px 0;
              }
              li {
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🎊 Hoş Geldin ${name}!</h1>
              <div class="content">
                <h2>Artık TakaZone ailesinin bir parçasısın!</h2>
                <p>Kullanmadığın eşyalarını takas ederek hem çevreye katkı sağla, hem de yeni şeyler kazan.</p>
                
                <h3>Neler yapabilirsin?</h3>
                <ul>
                  <li>📦 Kullanmadığın eşyalarını paylaş</li>
                  <li>🔄 Beğendiğin ürünleri kaydır ve takas et</li>
                  <li>💬 Diğer kullanıcılarla mesajlaş</li>
                  <li>⭐ Değerlendirme yap ve puan kazan</li>
                </ul>
                
                <center>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://takazone.com'}" class="button">
                    Hemen Başla 🚀
                  </a>
                </center>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; opacity: 0.9;">
                Sevgilerle,<br><strong>TakaZone Ekibi</strong>
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Welcome email send error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Hoş geldin emaili başarısız olsa bile kayıt devam etsin
    return null
  }
}

/**
 * Şifre sıfırlama emaili gönder
 */
export async function sendPasswordResetEmail(
  email: string,
  resetCode: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Şifre Sıfırlama Kodu 🔐',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                padding: 40px;
                border-radius: 16px;
                color: white;
              }
              .code-box {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin: 30px 0;
                border: 2px solid rgba(255, 255, 255, 0.3);
              }
              .code {
                font-size: 48px;
                font-weight: bold;
                letter-spacing: 8px;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🔐 Şifre Sıfırlama</h1>
              <p>Şifrenizi sıfırlamak için bir istek aldık.</p>
              <p>Aşağıdaki kodu kullanarak yeni şifrenizi oluşturabilirsiniz:</p>
              
              <div class="code-box">
                <div class="code">${resetCode}</div>
              </div>
              
              <p>Bu kod 15 dakika boyunca geçerlidir.</p>
              <p style="margin-top: 30px; font-size: 14px; opacity: 0.9;">
                Eğer bu isteği siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Password reset email error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}
