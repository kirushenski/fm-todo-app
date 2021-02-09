import { useEffect, useReducer } from 'react'

function useLocalStorage<T, A>(key: string, reducer: (state: T, action: A) => T, initialValue: T) {
  const [storedValue, dispatch] = useReducer(reducer, initialValue, () => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(error)
    }
  }, [key, storedValue])

  return [storedValue, dispatch] as [T, React.Dispatch<A>]
}

export default useLocalStorage
