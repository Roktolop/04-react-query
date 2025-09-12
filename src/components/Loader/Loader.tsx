import css from './Loader.module.css'

interface LoaderProps {
  message: string,
}

export default function Loader({message}: LoaderProps ) {
  return (<div><p className={css.text}>{message}</p></div>)
}