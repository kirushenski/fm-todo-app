import { v4 as uuid } from 'uuid'
import { Todo } from '@/components/TodoItem'

type ACTIONTYPE =
  | { type: 'ADD'; payload: string }
  | { type: 'TOGGLE'; payload: string }
  | { type: 'CLEAR'; payload: string }
  | { type: 'CLEAR_ALL_COMPLETED' }
  | { type: 'REORDER'; payload: { sourceIndex: number; destinationIndex: number } }

const todoListReducer = (state: Todo[], action: ACTIONTYPE) => {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: uuid(), value: action.payload, isCompleted: false }]
    case 'TOGGLE':
      return state.map(todo => (todo.id === action.payload ? { ...todo, isCompleted: !todo.isCompleted } : todo))
    case 'CLEAR':
      return state.filter(todo => todo.id !== action.payload)
    case 'CLEAR_ALL_COMPLETED':
      return state.filter(todo => !todo.isCompleted)
    case 'REORDER': {
      const newTodos = [...state]
      newTodos.splice(action.payload.sourceIndex, 1)
      newTodos.splice(action.payload.destinationIndex, 0, state[action.payload.sourceIndex])
      return newTodos
    }
    default:
      throw new Error()
  }
}

export default todoListReducer
