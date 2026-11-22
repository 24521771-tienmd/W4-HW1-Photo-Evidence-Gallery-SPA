import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="page page--text">
      <title>Page not found | Evidence Gallery</title>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <p>
        <Link className="button-link" to="/">
          Back to home
        </Link>
      </p>
    </div>
  )
}
