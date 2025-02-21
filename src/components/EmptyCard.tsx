import { NavigateFunction } from 'react-router-dom'

const EmptyBlog = ({ navigate }: { navigate: NavigateFunction }) => {
  return (
    <div className="card border">
      <div className="empty-card">
        <div style={{ marginBottom: 10 }}>Create your first blog.</div>
        <div>
          <button
            className="white-bg shadow"
            onClick={() => {
              navigate('/create/blog')
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

const EmptyBook = ({ navigate }: { navigate: NavigateFunction }) => {
  return (
    <div className="card border">
      <div className="empty-card">
        <div style={{ marginBottom: 10 }}>Create your first book.</div>
        <div>
          <button
            className="white-bg shadow"
            onClick={() => {
              navigate('/create/book')
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export { EmptyBlog, EmptyBook }
