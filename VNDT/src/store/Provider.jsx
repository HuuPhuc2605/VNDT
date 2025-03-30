import { useReducer } from "react";
import { StoreContext } from ".";
import reducer, { initState } from "./reducer";
import logger from "./logger";
function Provider({ children }) {
  const [state, dispacth] = useReducer(logger(reducer), initState);
  return (
    <StoreContext.Provider value={[state, dispacth]}>
      {children}
    </StoreContext.Provider>
  );
}
export default Provider;
