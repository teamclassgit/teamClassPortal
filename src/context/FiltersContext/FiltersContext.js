import React, { createContext, useState } from 'react'

export const FiltersContext = createContext()

const FiltersContextProvider = (props) => {
  const [classFilterContext, setClassFilterContext] = useState(null)
  const [coordinatorFilterContext, setCoordinatorFilterContext] = useState(null)
  const [textFilterContext, setTextFilterContext] = useState(null)
  const [dateFilterContext, setDateFilterContext] = useState(null)

  return (
    <FiltersContext.Provider
      value={{
        classFilterContext,
        setClassFilterContext,
        coordinatorFilterContext,
        setCoordinatorFilterContext,
        textFilterContext,
        setTextFilterContext,
        dateFilterContext,
        setDateFilterContext
      }}
    >
      {props.children}
    </FiltersContext.Provider>
  )
}

export default FiltersContextProvider
