import React from 'react'
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { ReactComponent as CheckIcon } from '@/icons/icon-check.svg'
import { ReactComponent as CrossIcon } from '@/icons/icon-cross.svg'

export interface Todo {
  id: string
  value: string
  isCompleted: boolean
}

interface TodoItemProps extends React.HTMLProps<HTMLLIElement> {
  todo: Todo
  provided: DraggableProvided
  snapshot: DraggableStateSnapshot
  handleCheckboxChange: (todo: Todo) => void
  handleClearButtonClick: (todo: Todo) => void
}

function TodoItem({
  todo,
  provided,
  snapshot,
  handleCheckboxChange,
  handleClearButtonClick,
  className = '',
  ...props
}: TodoItemProps) {
  return (
    <li
      ref={provided.innerRef}
      className={`group border-b border-light-gray-200 dark:border-dark-gray-700 flex items-center ${
        snapshot.isDragging ? 'focus:outline-dnd-active' : 'focus:outline-dnd dark:focus:outline-dnd-dark'
      } ${className}`}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      {...props}
    >
      <input
        type="checkbox"
        id={todo.id}
        checked={todo.isCompleted}
        onChange={() => handleCheckboxChange(todo)}
        className="sr-only"
      />
      <label htmlFor={todo.id} className="py-4 px-5 sm:py-5 sm:px-6 text-check cursor-pointer">
        <span className="sr-only">
          {todo.isCompleted ? 'Activate' : 'Complete'} &quot;{todo.value}&quot;
        </span>
        <span className="circle">{todo.isCompleted && <CheckIcon />}</span>
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
  )
}

export default React.memo(TodoItem)
