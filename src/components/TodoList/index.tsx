import React, { useCallback, useRef, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import useLocalStorage from '@/utils/useLocalStorage'
import TodoItem, { Todo } from '@/components/TodoItem'
import todoListReducer from './reducer'

function TodoList({ className = '', ...props }: React.HTMLProps<HTMLDivElement>) {
  const FILTERS = ['all', 'active', 'completed'] as const
  const [todos, dispatch] = useLocalStorage('todos', todoListReducer, [])
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
    dispatch({ type: 'ADD', payload: value })
    setStatus(`"${value}" todo was added`)
  }

  function handleFilterChange(selectedFilter: typeof FILTERS[number]) {
    setCurrentFilter(selectedFilter)
  }

  const handleCheckboxChange = useCallback(
    (selectedTodo: Todo) => {
      dispatch({ type: 'TOGGLE', payload: selectedTodo.id })
      setStatus(`"${selectedTodo.value}" todo was marked as ${selectedTodo.isCompleted ? 'completed' : 'active'}`)
      todoListRef.current?.focus()
    },
    [dispatch]
  )

  const handleClearButtonClick = useCallback(
    (selectedTodo: Todo) => {
      dispatch({ type: 'CLEAR', payload: selectedTodo.id })
      setStatus(`"${selectedTodo.value}" todo was removed`)
      todoListRef.current?.focus()
    },
    [dispatch]
  )

  function handleClearCompletedButtonClick() {
    dispatch({ type: 'CLEAR_ALL_COMPLETED' })
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
    dispatch({ type: 'REORDER', payload: { sourceIndex, destinationIndex } })
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
            <span className="py-4 px-5 sm:py-5 sm:px-6">
              <span className="circle" />
            </span>
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="Create a new todo..."
              className="flex-grow py-4 pr-5 sm:py-5 sm:pr-6 text-dark-gray-700 dark:text-dark-gray-200 placeholder-light-gray-400 dark:placeholder-dark-gray-300 leading-6"
            />
          </label>
          <button type="submit" hidden>
            Submit
          </button>
        </form>
        <div className="content-block outline-none" ref={todoListRef} tabIndex={-1}>
          {filteredTodos.length ? (
            <Droppable droppableId="list">
              {provided => (
                <ol ref={provided.innerRef} {...provided.droppableProps}>
                  {filteredTodos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided, snapshot) => (
                        <TodoItem
                          todo={todo}
                          provided={provided}
                          snapshot={snapshot}
                          handleCheckboxChange={handleCheckboxChange}
                          handleClearButtonClick={handleClearButtonClick}
                        />
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
