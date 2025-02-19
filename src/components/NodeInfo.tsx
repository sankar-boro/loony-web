import { timeAgo } from 'loony-utils'

export default function NodeInfo({ node }: { node: any }) {
  return (
    <div
      className="flex-row"
      style={{
        marginTop: 5,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="avatar"
        style={{
          width: 30,
          height: 30,
          backgroundColor: '#ccc',
          borderRadius: 30,
          marginRight: 10,
        }}
      ></div>
      <div className="uinfo">
        <div className="uname">Sankar Boro</div>
        <div className="time">{timeAgo(node.created_at)}</div>
      </div>
    </div>
  )
}
