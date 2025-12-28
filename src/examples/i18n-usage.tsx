// Örnek kullanım rehberi

import { useTranslation } from 'react-i18next'

// 1. Basic Usage
function ExampleComponent() {
  const { t } = useTranslation('common')
  
  return (
    <div>
      <h1>{t('save')}</h1>
      <p>{t('loading')}</p>
    </div>
  )
}

// 2. Multiple Namespaces
function MultiNamespaceComponent() {
  const { t } = useTranslation(['common', 'settings'])
  
  return (
    <div>
      <button>{t('common:save')}</button>
      <h1>{t('settings:title')}</h1>
    </div>
  )
}

// 3. Change Language Programmatically
function LanguageSwitcher() {
  const { i18n } = useTranslation()
  
  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng)
  }
  
  return (
    <select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
      <option value="tr">Türkçe</option>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="ar">العربية</option>
      <option value="da">Dansk</option>
    </select>
  )
}

// 4. Nested Translations
function NestedExample() {
  const { t } = useTranslation('settings')
  
  return (
    <div>
      <h2>{t('notifications:title')}</h2>
      <p>{t('notifications:pushDesc')}</p>
    </div>
  )
}

// 5. Dynamic Interpolation (for future use)
// Add to translation file: "welcome": "Hoş geldin, {{name}}!"
function InterpolationExample() {
  const { t } = useTranslation('home')
  
  return <p>{t('welcome', { name: 'Ahmet' })}</p>
  // Output: "Hoş geldin, Ahmet!"
}

export {
  ExampleComponent,
  MultiNamespaceComponent,
  LanguageSwitcher,
  NestedExample,
  InterpolationExample
}
