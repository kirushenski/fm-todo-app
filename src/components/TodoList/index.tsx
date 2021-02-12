import React, { useCallback, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import useLocalStorage from '@/utils/useLocalStorage'
import TodoItem, { Todo } from '@/components/TodoItem'
import Input from '@/components/Input'
import NavPanel from '@/components/NavPanel'
import todoListReducer from './reducer'

export const FILTERS = ['all', 'active', 'completed'] as const

function TodoList({ className = '', ...props }: React.HTMLProps<HTMLDivElement>) {
  const [todos, dispatch] = useLocalStorage('todos', todoListReducer, [])
  const [currentFilter, setCurrentFilter] = useState<typeof FILTERS[number]>('all')
  const [status, setStatus] = useState('')

  const filteredTodos = todos.filter(
    todo =>
      currentFilter === 'all' ||
      (currentFilter === 'active' && !todo.isCompleted) ||
      (currentFilter === 'completed' && todo.isCompleted)
  )
  const activeTodosCount = todos.filter(todo => !todo.isCompleted).length

  function handleSubmit(value: string) {
    dispatch({ type: 'ADD', payload: value })
    setStatus(`"${value}" todo was added`)
  }

  const handleCheckboxChange = useCallback(
    (selectedTodo: Todo) => {
      dispatch({ type: 'TOGGLE', payload: selectedTodo.id })
      setStatus(`"${selectedTodo.value}" todo was marked as ${selectedTodo.isCompleted ? 'completed' : 'active'}`)
    },
    [dispatch]
  )

  const handleClearButtonClick = useCallback(
    (selectedTodo: Todo) => {
      dispatch({ type: 'CLEAR', payload: selectedTodo.id })
      setStatus(`"${selectedTodo.value}" todo was removed`)
    },
    [dispatch]
  )

  function handleFilterChange(selectedFilter: typeof FILTERS[number]) {
    setCurrentFilter(selectedFilter)
  }

  function handleClearCompletedButtonClick() {
    dispatch({ type: 'CLEAR_ALL_COMPLETED' })
    setStatus('All completed todos were removed')
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
        <Input onSubmit={handleSubmit} />
        <div className="content-block outline-none" tabIndex={-1}>
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
          <NavPanel
            activeTodosCount={activeTodosCount}
            currentFilter={currentFilter}
            handleFilterChange={handleFilterChange}
            handleClearCompletedButtonClick={handleClearCompletedButtonClick}
          />
        </div>
      </div>
    </DragDropContext>
  )
}

export default TodoList
