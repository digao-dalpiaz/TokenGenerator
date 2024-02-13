import { get, set } from "./utils";

export default function Input(props) {

  return <>
    <span>{props.label}</span>
    <input type={props.datetime ? 'datetime-local' : 'text'} className="form-control"
      value={get(props.compValue)} onChange={ev => set(props.compValue, ev.target.value)} />
  </>

}