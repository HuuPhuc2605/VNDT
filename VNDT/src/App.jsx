import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UseReducerComponent from "./components/UseReducerComponent";
import UseRefComponent from "./components/UseRefComponent";
import HomePage from "./pages/HomePage";
import RootPage from "./components/RootPage";
import UseEffectComponent from "./components/UseEffectComponent";
import Memomo from "./components/Memomo";
import UseCallbackComponent from "./components/UseCallbackComponent";
import UseMemoComponent from "./components/UseMemoComponent";
import UseContextComponent from "./store/UseContextComponent";
import Calculator from "./components/Calculator";
import TodoApp from "./components/TodoApp";
const router = createBrowserRouter([
  {
    path: "",
    element: <RootPage />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "/reducer", element: <UseReducerComponent /> },
      { path: "/effect", element: <UseEffectComponent /> },
      { path: "/ref", element: <UseRefComponent /> },
      { path: "/memo", element: <Memomo /> },
      { path: "/callback", element: <UseCallbackComponent /> },
      { path: "/usememo", element: <UseMemoComponent /> },
      { path: "/usecontext", element: <TodoApp /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}
export default App;
