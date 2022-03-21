import { Link } from "react-router-dom"

const PageNotFound = () => {
  return (
    <div className='page-not-found'>
      <h1>404 - Page Not Found!!!</h1>
      <Link to='/'>Go Home</Link>
    </div>
  )
}

export default PageNotFound;