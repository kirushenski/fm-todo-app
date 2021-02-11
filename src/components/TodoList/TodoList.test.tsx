import React from 'react'
import { render, screen } from '@test-utils'
import userEvent, { specialChars } from '@testing-library/user-event'
import faker from 'faker'
import { v4 as uuid } from 'uuid'
import TodoList from '.'
import todoListReducer from './reducer'

beforeEach(() => {
  window.localStorage.setItem('todos', '[]')
})

test('Submitting value via input adds todos in the list', () => {
  render(<TodoList />)

  const input = screen.getByLabelText(/create/i)
  const firstTodo = faker.lorem.words(3)
  userEvent.type(input, `${firstTodo}${specialChars.enter}`)
  const secondTodo = faker.lorem.words(3)
  userEvent.type(input, `${secondTodo}${specialChars.enter}`)

  const list = screen.getByRole('list')
  const counter = screen.getByText(/items? left/)
  expect(list.children).toHaveLength(2)
  expect(list.children[0]).toHaveTextContent(firstTodo)
  expect(list.children[1]).toHaveTextContent(secondTodo)
  expect(counter).toHaveTextContent('2')
})

test('Click on checkbox moves todo item between active and completed statuses', () => {
  render(<TodoList />)

  const input = screen.getByLabelText(/create/i)
  const newTodo = faker.lorem.words(3)
  userEvent.type(input, `${newTodo}${specialChars.enter}`)

  expect(screen.getByRole('list').children).toHaveLength(1)
  userEvent.click(screen.getByLabelText(/^active$/i))
  expect(screen.getByRole('list').children).toHaveLength(1)
  userEvent.click(screen.getByLabelText(/complete "/i))
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
  userEvent.click(screen.getByLabelText(/^completed$/i))
  expect(screen.getByRole('list').children).toHaveLength(1)
  userEvent.click(screen.getByLabelText(/activate "/i))
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
})

test('Clear button removes todo item from the list', () => {
  render(<TodoList />)

  const input = screen.getByLabelText(/create/i)
  const newTodo = faker.lorem.words(3)
  userEvent.type(input, `${newTodo}${specialChars.enter}`)

  const counter = screen.getByText(/items? left/)
  expect(counter).toHaveTextContent('1')
  userEvent.click(screen.getByTitle(/clear "/i).parentNode as HTMLElement)
  expect(counter).toHaveTextContent('0')
})

test('Clear completed button clears all completed todos from the list', () => {
  render(<TodoList />)

  const input = screen.getByLabelText(/create/i)
  const firstTodo = faker.lorem.words(3)
  userEvent.type(input, `${firstTodo}${specialChars.enter}`)
  const secondTodo = faker.lorem.words(3)
  userEvent.type(input, `${secondTodo}${specialChars.enter}`)

  const [firstCheckbox, secondCheckbox] = screen.getAllByLabelText(/complete "/i)
  userEvent.click(firstCheckbox)
  userEvent.click(secondCheckbox)
  expect(screen.getByRole('list').children).toHaveLength(2)
  userEvent.click(screen.getByRole('button', { name: /^clear completed$/i }))
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
})

test('Interface shows empty list messages based on applied filter', () => {
  render(<TodoList />)

  const input = screen.getByLabelText(/create/i)
  const newTodo = faker.lorem.words(3)
  userEvent.type(input, `${newTodo}${specialChars.enter}`)

  userEvent.click(screen.getByLabelText(/^completed$/i))
  expect(screen.getByText(/you don't have/i).textContent).toMatchInlineSnapshot(
    `"You don't have completed todos yet. Just do it!"`
  )
  userEvent.click(screen.getByLabelText(/^active$/i))
  userEvent.click(screen.getByLabelText(/complete "/i))
  expect(screen.getByText(/you don't have/i).textContent).toMatchInlineSnapshot(
    `"You don't have active todos left. Well done!"`
  )
  userEvent.click(screen.getByRole('button', { name: /^clear completed$/i }))
  expect(screen.getByText(/you don't have/i).textContent).toMatchInlineSnapshot(
    `"You don't have any todos. Try to add one!"`
  )
})

test('Reducer works properly with all supported actions', () => {
  let state = [
    { id: uuid(), value: faker.lorem.words(3), isCompleted: false },
    { id: uuid(), value: faker.lorem.words(3), isCompleted: true },
  ]

  state = todoListReducer(state, { type: 'ADD', payload: faker.lorem.words(3) })
  expect(state).toHaveLength(3)

  state = todoListReducer(state, { type: 'TOGGLE', payload: state[2].id })
  expect(state[2].isCompleted).toBe(true)

  const firstTodoId = state[0].id
  const lastTodoId = state[2].id
  state = todoListReducer(state, { type: 'REORDER', payload: { sourceIndex: 2, destinationIndex: 0 } })
  expect(state[0].id).toBe(lastTodoId)
  expect(state[1].id).toBe(firstTodoId)

  state = todoListReducer(state, { type: 'CLEAR', payload: state[1].id })
  expect(state).toHaveLength(2)

  state = todoListReducer(state, { type: 'CLEAR_ALL_COMPLETED' })
  expect(state).toHaveLength(0)
})
