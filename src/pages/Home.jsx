import { Link } from 'react-router'

export default function Home() {
  return (
    <div className="page page--text">
      <title>Home | Evidence Gallery</title>
      <h1>Case Evidence Archive</h1>
      <p>
        A browsable archive of photographs documenting devices, scenes and documents. Filter by
        category and open any photo in an accessible lightbox.
      </p>
      <p>
        <Link className="button-link" to="/gallery">
          Browse the gallery
        </Link>
      </p>
    </div>
  )
}
