import React from 'react'

const defineColorScheme = () => {
  const siteLevelColorScheme = localStorage.getItem('theme')

  let osLevelColorScheme
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const hasMediaQueryPreference = typeof mql.matches === 'boolean'
  if (hasMediaQueryPreference) osLevelColorScheme = mql.matches ? 'dark' : 'light'

  if (siteLevelColorScheme === 'dark' || (siteLevelColorScheme !== 'light' && osLevelColorScheme !== 'light')) {
    document.documentElement.classList.add('dark')
  }
}

const ColorSchemeScript = () => {
  return <script dangerouslySetInnerHTML={{ __html: `(${defineColorScheme})()` }} />
}

export const onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents(<ColorSchemeScript />)
}

export { wrapRootElement } from './gatsby-browser'
