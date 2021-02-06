import React, { useState } from 'react'
import Seo from '@/components/Seo'
import { ReactComponent as MoonIcon } from '@/icons/icon-moon.svg'
import { ReactComponent as SunIcon } from '@/icons/icon-sun.svg'
import TodoList from '@/components/TodoList'

function IndexPage() {
  const [colorScheme, setColorScheme] = useState('light')

  return (
    <div className="min-h-screen px-6 py-12 bg-light-mobile dark:bg-dark-mobile sm:bg-light-desktop dark:sm:bg-dark-desktop bg-no-repeat bg-mobile sm:bg-desktop">
      <Seo title="Frontend Mentor: Todo app" />
      <main className="max-w-container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="uppercase font-bold text-xl sm:text-heading tracking-heading text-white">Todo</h1>
          <button
            onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
            aria-label="Dark mode"
            aria-pressed={colorScheme === 'dark'}
            className="text-white text-xl sm:text-icon"
          >
            {colorScheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
        <TodoList className="mb-10 sm:mb-12" />
        <div className="text-sm text-light-gray-400 dark:text-dark-gray-400 text-center">
          Drag and drop to reorder list
        </div>
      </main>
    </div>
  )
}

export default IndexPage
