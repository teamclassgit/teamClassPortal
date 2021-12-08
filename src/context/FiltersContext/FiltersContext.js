import React, { createContext, useState, useEffect } from 'react';
import { getUserData } from '../../utility/Utils';

export const FiltersContext = createContext();

const FiltersContextProvider = (props) => {
  const [classFilterContext, setClassFilterContext] = useState(null);
  const [coordinatorFilterContext, setCoordinatorFilterContext] = useState(null);
  const [textFilterContext, setTextFilterContext] = useState(null);
  const [dateFilterContext, setDateFilterContext] = useState(null);
  const [closedReasonFilterContext, setClosedReasonFilterContext] = useState(null);

  useEffect(() => {
    const userData = getUserData();
    if (userData && userData.customData && userData.customData.coordinatorId) setCoordinatorFilterContext({
      type: 'coordinator',
      value: [userData.customData.coordinatorId],
      label: [userData.customData.name]
    });
  }, []);


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
        setDateFilterContext,
        closedReasonFilterContext,
        setClosedReasonFilterContext
      }}
    >
      {props.children}
    </FiltersContext.Provider>
  );
};

export default FiltersContextProvider;
