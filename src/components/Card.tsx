import { parseImage, timeAgo } from 'loony-utils'
import { NavigateFunction } from 'react-router-dom'
import { DocNode } from 'loony-types'

const Card = ({
  node,
  navigate,
  nodeType,
  base_url,
}: {
  node: DocNode
  navigate: NavigateFunction
  nodeType: string
  base_url: string
}) => {
  const image = parseImage(node.images)
  return (
    <div className="card" key={node.uid}>
      <div
        className="card-image"
        style={{
          backgroundImage:
            image && image.name
              ? `url("${base_url}/api/${nodeType}/${node.uid}/340/${image.name}")`
              : undefined,
          overflow: 'hidden',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
        onClick={() => {
          navigate(`/view/${nodeType}/${node.uid}`)
        }}
      />
      <div className="card-body">
        <div
          className="card-title cursor"
          onClick={() => {
            navigate(`/view/${nodeType}/${node.uid}`)
          }}
        >
          {node.title}
        </div>
        <div className="flex-row card-info">
          <div className="avatar" />
          <div className="uinfo">
            <div className="uname">Sankar Boro</div>
            <div className="time">{timeAgo(node.created_at)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
