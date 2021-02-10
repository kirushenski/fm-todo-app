import React from 'react'
import { render, screen } from '@test-utils'
import userEvent, { specialChars } from '@testing-library/user-event'
import faker from 'faker'
import TodoList from '.'

test('Submitting value via input creates a list with this one element', () => {
  render(<TodoList />)

  expect(screen.queryByRole('list')).not.toBeInTheDocument()

  const newTodo = faker.lorem.words(3)
  userEvent.type(screen.getByLabelText(/create/i), `${newTodo}${specialChars.enter}`)

  const list = screen.getByRole('list')
  expect(list.children).toHaveLength(1)
  expect(list.children[0]).toHaveTextContent(newTodo)
})
