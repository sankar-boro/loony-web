import { MdOutlineEdit, MdContentCopy, MdAdd } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { EditBookAction, EditBookState, DocNode } from 'loony-types'

const Button = ({
  onClick,
  icon,
}: {
  onClick: React.MouseEventHandler<HTMLDivElement>
  icon: React.ReactNode
}) => {
  return (
    <div
      className="button-none cursor"
      onClick={onClick}
      style={{ marginRight: 10 }}
    >
      <div className="btn-action">{icon}</div>
    </div>
  )
}

export const PageNodeSettings = ({
  node,
  setState,
  state,
}: {
  node: DocNode
  setState: EditBookAction
  state: EditBookState
}) => {
  return (
    <>
      <div className="flex-row" style={{ marginTop: 24 }}>
        {node.identity >= 102 ? (
          <Button
            icon={<MdAdd size={16} color="#9c9c9c" />}
            onClick={(e) => {
              setState({
                ...state,
                topNode: node,
                form: 'add_sub_section',
              })
              e.stopPropagation()
            }}
          />
        ) : null}
        <Button
          icon={<AiOutlineDelete size={16} color="#9c9c9c" />}
          onClick={(e) => {
            setState({
              ...state,
              deleteNode: node,
              modal: 'delete_page',
            })
            e.stopPropagation()
          }}
        />
        <Button
          icon={<MdOutlineEdit size={16} color="#9c9c9c" />}
          onClick={(e) => {
            setState({
              ...state,
              topNode: node,
              editNode: node,
              form: 'edit_node',
            })
            e.stopPropagation()
          }}
        />
        <Button
          icon={<MdContentCopy size={16} color="#9c9c9c" />}
          onClick={(e) => {
            navigator.clipboard.writeText(node.content)
            e.stopPropagation()
          }}
        />
      </div>
    </>
  )
}
