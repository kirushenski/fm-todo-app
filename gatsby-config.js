const config = {
  // Project title. Used as SEO title and PWA name
  title: 'Frontend Mentor: Todo app',
  // Project short name. Used by PWA
  shortTitle: 'FM Todo app',
  // Project description. Used in SEO meta tag and by PWA
  description: 'My solution for Frontend Mentor "Todo app" challenge',
  // Keywords describing the project. Used in SEO meta tag
  keywords: ['frontend', 'challenges', 'react'],
  // Absolute deployment path (without trailing slash). Used as base URL in SEO meta tags
  baseUrl: 'https://p1t1ch-fm-todo-app.netlify.app',
  // Site language. Added in html tag and PWA manifest
  lang: 'en',
  // Your username on Twitter (without @). Used in SEO meta tags
  twitterUsername: 'p1t1ch',
  // Path to main favicon. Recommended size: 512x512. Other sizes are generated automatically
  favicon: 'src/images/favicon.png',
  // Theme color. Used as color of device toolbar in supported browsers
  themeColor: '#FAFAFA',
  // Background color. Used as background on PWA launch screen. Recommended to make it the same as body color
  backgroundColor: '#FAFAFA',
}

module.exports = {
  siteMetadata: {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    baseUrl: config.baseUrl,
    lang: config.lang,
    twitterUsername: config.twitterUsername,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-postcss',
    {
      resolve: 'gatsby-alias-imports',
      options: {
        aliases: {
          '@': `${__dirname}/src`,
        },
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaultQuality: 75,
      },
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-svgr',
      options: {
        titleProp: true,
      },
    },
    {
      resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
      options: {
        analyzerMode: 'static',
        defaultSizes: 'gzip',
        openAnalyzer: false,
        generateStatsFile: true,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        start_url: '/',
        display: 'standalone',
        name: config.title,
        short_name: config.shortTitle,
        description: config.description,
        lang: config.lang,
        icon: config.favicon,
        theme_color: config.themeColor,
        background_color: config.backgroundColor,
      },
    },
    'gatsby-plugin-offline',
  ],
}
