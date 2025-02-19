import { Link } from 'react-router-dom'

const EmptyBlog = () => {
  return (
    <div className="card border">
      <div className="empty-card">
        <div style={{ marginBottom: 10 }}>Create your first blog.</div>
        <div>
          <button>
            <Link to="/create/blog">Create</Link>
          </button>
        </div>
      </div>
    </div>
  )
}

const EmptyBook = () => {
  return (
    <div className="card border">
      <div className="empty-card">
        <div style={{ marginBottom: 10 }}>Create your first book.</div>
        <div>
          <button>
            <Link to="/create/book">Create</Link>
          </button>
        </div>
      </div>
    </div>
  )
}

export { EmptyBlog, EmptyBook }
