import { MdOutlineEdit, MdContentCopy, MdAdd } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';

export const PageNodeSettings = ({ node, setState, state }) => {
  return (
    <>
      {node.identity >= 100 ? (
        <div className='flex-row' style={{ marginTop: 24 }}>
          <div
            className='button-none cursor'
            onClick={(e) => {
              setState({
                ...state,
                topNode: node,
                modal: 'add_sub_section',
              });
              e.stopPropagation();
            }}
            style={{ marginRight: 10 }}
          >
            <div className='btn-action'>
              <MdAdd size={16} color='#9c9c9c' />
            </div>
          </div>

          <div
            className='button-none cursor'
            onClick={(e) => {
              setState({
                ...state,
                deleteNode: node,
                modal: 'delete_page',
              });
              e.stopPropagation();
            }}
            style={{ marginRight: 10 }}
          >
            <div className='btn-action'>
              <AiOutlineDelete size={16} color='#9c9c9c' />
            </div>
          </div>

          <div
            className='button-none cursor'
            onClick={(e) => {
              setState({
                ...state,
                editNode: node,
                modal: 'edit_node',
              });
              e.stopPropagation();
            }}
            style={{ marginRight: 10 }}
          >
            <div className='btn-action'>
              <MdOutlineEdit size={16} color='#9c9c9c' />
            </div>
          </div>

          <div
            className='delete-button-none cursor'
            onClick={(e) => {
              navigator.clipboard.writeText(node.body);
              e.stopPropagation();
            }}
          >
            <div className='btn-action'>
              <MdContentCopy size={16} color='#9c9c9c' />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
