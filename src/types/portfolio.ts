export type SiteLocation = {
  city: string
  region: string
  country: string
}

export type WorksFor = {
  name: string
}

export type SEO = {
  locale: string
  openGraphType: string
  titleTemplate: string
}

export type PageSEO = {
  title: string
  description: string
}

export type Portfolio = {
  siteName: string
  ogDescription: string
  ogTitle: string
  publicUrl: string
  profileImage: string
  email: string
  githubUrl: string
  linkedinUrl: string
  gtag: string
  name: string
  fullName: string
  jobTitle: string
  location: SiteLocation
  worksFor: WorksFor
  sameAs: string[]
  ogImageAlt: string
  profileImageAlt: string
  seo: SEO
  pages: Record<string, PageSEO>
  skills: (string | number)[]
  about: string
  experience: Array<{
    position: string
    company: string
    time: string
    level: string
    description: string
    image: string
  }>
  projects: Array<{
    name: string
    position: string
    time: string
    url: string
  }>
  depricatedProjects: Array<{
    name: string
    position: string
    time: string
    image: string
  }>
}
