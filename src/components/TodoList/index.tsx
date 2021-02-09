import React, { useRef, useState } from 'react'
import useLocalStorage from '@/utils/useLocalStorage'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import { ReactComponent as CheckIcon } from '@/icons/icon-check.svg'
import { ReactComponent as CrossIcon } from '@/icons/icon-cross.svg'

// TODO state management solutions
// TODO performance optimization

interface Todo {
  id: string
  value: string
  isCompleted: boolean
}

function TodoList({ className = '', ...props }: React.HTMLProps<HTMLDivElement>) {
  const FILTERS = ['all', 'active', 'completed'] as const
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', [
    { id: uuidv4(), value: 'Do the job right', isCompleted: false },
    { id: uuidv4(), value: 'Do the job right 2', isCompleted: true },
    { id: uuidv4(), value: 'Do the job right 3', isCompleted: false },
  ])
  const [value, setValue] = useState('')
  const [currentFilter, setCurrentFilter] = useState<typeof FILTERS[number]>('all')
  const [status, setStatus] = useState('')

  const filteredTodos = todos.filter(
    todo =>
      currentFilter === 'all' ||
      (currentFilter === 'active' && !todo.isCompleted) ||
      (currentFilter === 'completed' && todo.isCompleted)
  )
  const activeTodosCount = todos.filter(todo => !todo.isCompleted).length

  const todoListRef = useRef<HTMLDivElement>(null)

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!value.trim()) return
    setValue('')
    setTodos([...todos, { id: uuidv4(), value, isCompleted: false }])
    setStatus(`"${value}" todo was added`)
  }

  function handleCheckboxChange(selectedTodo: Todo) {
    setTodos(todos.map(todo => (todo === selectedTodo ? { ...todo, isCompleted: !todo.isCompleted } : todo)))
    setStatus(`"${selectedTodo.value}" todo was marked as ${selectedTodo.isCompleted ? 'completed' : 'active'}`)
    todoListRef.current?.focus()
  }

  function handleFilterChange(selectedFilter: typeof FILTERS[number]) {
    setCurrentFilter(selectedFilter)
  }

  function handleClearButtonClick(selectedTodo: Todo) {
    setTodos(todos.filter(todo => todo !== selectedTodo))
    setStatus(`"${selectedTodo.value}" todo was removed`)
    todoListRef.current?.focus()
  }

  function handleClearCompletedButtonClick() {
    setTodos(todos.filter(todo => !todo.isCompleted))
    setStatus('All completed todos were removed')
    todoListRef.current?.focus()
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return

    const sourceIndex = todos.findIndex(todo => todo.id === filteredTodos[result.source.index].id)
    const destinationIndex = todos.findIndex(todo => todo.id === filteredTodos[(result.destination as any).index].id)
    if (destinationIndex === sourceIndex) return

    const newTodos = [...todos]
    newTodos.splice(sourceIndex, 1)
    newTodos.splice(destinationIndex, 0, todos[sourceIndex])
    setTodos(newTodos)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`${className}`} {...props}>
        <div role="status" aria-live="polite" className="sr-only">
          {status}
        </div>
        <form onSubmit={handleSubmit} className="content-block mb-6">
          <label className="flex items-center">
            <span className="sr-only">Create a new todo</span>
            <div className="py-4 px-5 sm:py-5 sm:px-6">
              <div className="circle" />
            </div>
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="Create a new todo..."
              className="flex-grow py-4 pr-5 sm:py-5 sm:pr-6 text-dark-gray-700 dark:text-dark-gray-200 placeholder-light-gray-400 dark:placeholder-dark-gray-300 leading-6"
            />
          </label>
        </form>
        <div className="content-block" ref={todoListRef} tabIndex={-1}>
          {filteredTodos.length ? (
            <Droppable droppableId="list">
              {provided => (
                <ol ref={provided.innerRef} {...provided.droppableProps}>
                  {filteredTodos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          className={`group border-b border-light-gray-200 dark:border-dark-gray-700 flex items-center ${
                            snapshot.isDragging
                              ? 'focus:outline-dnd-active'
                              : 'focus:outline-dnd dark:focus:outline-dnd-dark'
                          }`}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <input
                            type="checkbox"
                            id={todo.id}
                            checked={todo.isCompleted}
                            onChange={() => handleCheckboxChange(todo)}
                            className="sr-only"
                          />
                          <label htmlFor={todo.id} className="py-4 px-5 sm:py-5 sm:px-6 text-check cursor-pointer">
                            <span className="sr-only">Complete &quot;{todo.value}&quot;</span>
                            <div className="circle">{todo.isCompleted && <CheckIcon />}</div>
                          </label>
                          <div
                            className={`py-4 sm:py-5 flex-grow leading-6 ${
                              todo.isCompleted ? 'line-through text-light-gray-300 dark:text-dark-gray-500' : ''
                            }`}
                          >
                            {todo.value}
                          </div>
                          <button
                            onClick={() => handleClearButtonClick(todo)}
                            className="py-5 sm:py-cross px-5 sm:px-6 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity dark:text-dark-gray-400"
                          >
                            <CrossIcon title={`Clear "${todo.value}"`} />
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
          ) : (
            <div className="py-4 px-5 sm:py-5 sm:px-6 text-center border-b border-light-gray-200 dark:border-dark-gray-700 leading-6">
              You don&apos;t have{' '}
              {todos.length && currentFilter === 'active'
                ? 'active todos left. Well done!'
                : todos.length && currentFilter === 'completed'
                ? 'completed todos yet. Just do it!'
                : 'any todos. Try to add one!'}
            </div>
          )}
          <nav className="flex flex-wrap sm:items-center justify-between sm:justify-start px-5 sm:px-6 text-xs sm:text-sm text-light-gray-400 dark:text-dark-gray-400">
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
        </div>
      </div>
    </DragDropContext>
  )
}

export default TodoList
