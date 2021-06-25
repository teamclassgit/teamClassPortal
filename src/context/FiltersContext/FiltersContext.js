import React, { createContext, useState } from 'react'

export const FiltersContext = createContext()

const FiltersContextProvider = (props) => {
  const [classFilterContext, setClassFilterContext] = useState(null)

  return (
    <FiltersContext.Provider
      value={{
        classFilterContext,
        setClassFilterContext
      }}
    >
      {props.children}
    </FiltersContext.Provider>
  )
}

export default FiltersContextProvider
