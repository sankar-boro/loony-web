import { MdOutlineEdit, MdContentCopy, MdAdd } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { BookEditAction, BookEditState, Node } from '../../types/index.tsx'

const Button = ({ onClick, icon }: { onClick: any; icon: any }) => {
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
  node: Node
  setState: BookEditAction
  state: BookEditState
}) => {
  return (
    <>
      <div className="flex-row" style={{ marginTop: 24 }}>
        {node.identity >= 102 ? (
          <Button
            icon={<MdAdd size={16} color="#9c9c9c" />}
            onClick={(e: any) => {
              setState({
                ...state,
                topNode: node,
                modal: 'add_sub_section',
              })
              e.stopPropagation()
            }}
          />
        ) : null}
        <Button
          icon={<AiOutlineDelete size={16} color="#9c9c9c" />}
          onClick={(e: any) => {
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
          onClick={(e: any) => {
            setState({
              ...state,
              editNode: node,
              modal: 'edit_node',
            })
            e.stopPropagation()
          }}
        />
        <Button
          icon={<MdContentCopy size={16} color="#9c9c9c" />}
          onClick={(e: any) => {
            navigator.clipboard.writeText(node.body)
            e.stopPropagation()
          }}
        />
      </div>
    </>
  )
}
