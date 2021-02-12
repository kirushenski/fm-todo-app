import React from 'react'
import { FILTERS } from '@/components/TodoList'

interface NavPanelProps extends React.HTMLProps<HTMLDivElement> {
  activeTodosCount: number
  currentFilter: typeof FILTERS[number]
  handleFilterChange: (filter: typeof FILTERS[number]) => void
  handleClearCompletedButtonClick: () => void
}

function NavPanel({
  activeTodosCount,
  currentFilter,
  handleFilterChange,
  handleClearCompletedButtonClick,
  className = '',
  ...props
}: NavPanelProps) {
  return (
    <nav
      className={`flex flex-wrap sm:items-center justify-between sm:justify-start px-5 sm:px-6 text-xs sm:text-sm text-light-gray-400 dark:text-dark-gray-400 ${className}`}
      {...props}
    >
      <div className="pt-4 sm:pt-0 leading-none">
        {activeTodosCount} item{activeTodosCount % 10 !== 1 ? 's' : ''} left
      </div>
      <div className="order-2 sm:order-none flex-grow flex justify-center text-sm font-bold leading-none">
        {FILTERS.map(filter => (
          <React.Fragment key={filter}>
            <input
              type="radio"
              name="filter"
              id={filter}
              value={filter}
              checked={filter === currentFilter}
              onChange={() => handleFilterChange(filter)}
              className="sr-only"
            />
            <label
              htmlFor={filter}
              className="block px-2 pt-4 pb-5 hover:text-light-gray-500 dark:hover:text-dark-gray-100 cursor-pointer transition-colors"
            >
              {filter[0].toUpperCase()}
              {filter.slice(1)}
            </label>
          </React.Fragment>
        ))}
      </div>
      <button
        onClick={handleClearCompletedButtonClick}
        className="order-1 sm:order-none pb-2 pt-4 sm:pb-5 hover:text-light-gray-500 focus-visible:text-light-gray-500 dark:hover:text-dark-gray-100 leading-none transition-colors"
      >
        Clear Completed
      </button>
    </nav>
  )
}

export default NavPanel
