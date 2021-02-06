import React from 'react'

// interface TodoListProps extends React.HTMLProps<HTMLDivElement> {

// }

function TodoList({ className = '', ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={`${className}`} {...props}>
      Hi
    </div>
  )
}

export default TodoList
