import { useContext } from "react";
import Context from "./Context";
export const useStore = () => {
  const [state, dispacth] = useContext(Context);
  return [state, dispacth];
};
