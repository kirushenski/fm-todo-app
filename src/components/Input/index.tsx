import React, { useState } from 'react'

interface InputProps extends Omit<React.HTMLProps<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (value: string) => void
}

function Input({ onSubmit, className = '', ...props }: InputProps) {
  const [value, setValue] = useState('')

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!value.trim()) return
    setValue('')
    onSubmit(value)
  }

  return (
    <form onSubmit={handleSubmit} className={`content-block mb-6 ${className}`} {...props}>
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
  )
}

export default Input
