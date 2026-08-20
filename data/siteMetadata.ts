interface SiteMetadata {
  title: string
  author: string
  headerTitle: string
  description: string
  language: string
  theme: 'system' | 'dark' | 'light'
  gridBackground: 'animated' | 'minimal' | 'none'
  siteUrl: string
  email: string
  locale: string
  search: {
    provider: 'kbar'
  }
  headingScrollOffset: string
}

const siteMetadata: SiteMetadata = {
  title: "Rickee's Blog",
  author: 'RickeeX',
  headerTitle: "Rickee's Corner",
  description: 'Per Aspera Ad Astra. 循此苦旅，以達天際。',
  language: 'en-us',
  theme: 'dark',
  gridBackground: 'minimal',
  siteUrl: 'https://rickeex.com',
  email: 'rickeex@outlook.com',
  locale: 'en-US',
  search: {
    provider: 'kbar',
  },
  headingScrollOffset: '100px',
}

export default siteMetadata
