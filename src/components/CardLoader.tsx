const CardLoader = () => {
  return (
    <div className="card">
      <div
        className="card-image"
        style={{
          overflow: 'hidden',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
      />
      <div className="card-body">
        <div className="card-l-title cursor" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <div className="card-avatar" />
            <div style={{ width: 100, marginLeft: 14 }}>
              <div
                className="card-l-title cursor"
                style={{ width: 100, marginBottom: 10, height: 8 }}
              />
              <div
                className="card-l-title cursor"
                style={{ width: 80, height: 6 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardLoader
