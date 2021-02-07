import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
// import { ReactComponent as CheckIcon } from '@/icons/icon-check.svg'
import { ReactComponent as CrossIcon } from '@/icons/icon-cross.svg'

// TODO: добавить склонения к items

interface Todo {
  id: string
  value: string
  isCompleted: boolean
}

function TodoList({ className = '', ...props }: React.HTMLProps<HTMLDivElement>) {
  const FILTERS = ['all', 'active', 'completed'] as const
  const [todos, setTodos] = useState<Todo[]>([
    { id: uuidv4(), value: 'Do the job right', isCompleted: false },
    { id: uuidv4(), value: 'Do the job right 2', isCompleted: true },
    { id: uuidv4(), value: 'Do the job right 3', isCompleted: false },
  ])
  const [value, setValue] = useState('')
  const [currentFilter, setCurrentFilter] = useState<typeof FILTERS[number]>('all')

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!value.trim()) return
    setValue('')
    setTodos([...todos, { id: uuidv4(), value, isCompleted: false }])
  }

  function handleCheckboxChange(selectedTodo: Todo) {
    setTodos(todos.map(todo => (todo === selectedTodo ? { ...todo, isCompleted: !todo.isCompleted } : todo)))
  }

  function handleFilterChange(selectedFilter: typeof FILTERS[number]) {
    setCurrentFilter(selectedFilter)
  }

  function handleClearButtonClick(selectedTodo: Todo) {
    setTodos(todos.filter(todo => todo !== selectedTodo))
  }

  function handleClearCompletedButtonClick() {
    setTodos(todos.filter(todo => !todo.isCompleted))
  }

  return (
    <div className={`${className}`} {...props}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo" className="sr-only">
          Create a new todo
        </label>
        <input
          type="text"
          id="new-todo"
          value={value}
          onChange={handleInputChange}
          placeholder="Create a new todo..."
          className="bg-white dark:bg-dark-gray-800"
        />
      </form>
      <div className="bg-white dark:bg-dark-gray-800">
        <ol>
          {todos
            .filter(
              todo =>
                currentFilter === 'all' ||
                (currentFilter === 'active' && !todo.isCompleted) ||
                (currentFilter === 'completed' && todo.isCompleted)
            )
            .map(todo => (
              <li key={todo.id}>
                <label>
                  <input type="checkbox" checked={todo.isCompleted} onChange={() => handleCheckboxChange(todo)} />
                  <span className="sr-only">Complete &quot;{todo.value}&quot;</span>
                </label>
                <div>{todo.value}</div>
                <button onClick={() => handleClearButtonClick(todo)}>
                  <CrossIcon title={`Clear "${todo.value}"`} />
                </button>
              </li>
            ))}
        </ol>
        <div>
          <div>{todos.filter(todo => !todo.isCompleted).length} items left</div>
          <div>
            {FILTERS.map(filter => (
              <label key={filter}>
                <input
                  type="radio"
                  name="filter"
                  value={filter}
                  checked={filter === currentFilter}
                  onChange={() => handleFilterChange(filter)}
                />
                {filter.toUpperCase()}
              </label>
            ))}
          </div>
          <button onClick={handleClearCompletedButtonClick}>Clear Completed</button>
        </div>
      </div>
    </div>
  )
}

export default TodoList
