import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Page from "./page";

export default function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Page />
    </div>
  );
}
