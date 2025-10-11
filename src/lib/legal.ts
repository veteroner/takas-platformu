export const policyVersions = {
  terms: 'v1',
  kvkk: 'v1',
  privacy: 'v1',
  cookies: 'v1',
  marketing: 'v1',
  email: 'v1',
} as const

export const policyRoutes = {
  terms: '/legal/uyelik-sozlesmesi',
  kvkk: '/legal/kvkk-aydinlatma',
  privacy: '/legal/gizlilik-politikasi',
  cookies: '/legal/cerez-politikasi',
  consent: '/legal/acik-riza',
} as const

export type ConsentSelections = {
  terms: boolean
  kvkk: boolean
  privacy: boolean
  cookies: boolean
  marketing?: boolean
  email?: boolean
}


