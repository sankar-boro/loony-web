import { MdOutlineEdit, MdContentCopy, MdAdd } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';

const Button = ({ onClick, icon }) => {
  return (
    <div className='button-none cursor' onClick={onClick} style={{ marginRight: 10 }}>
      <div className='btn-action'>{icon}</div>
    </div>
  );
};

export const PageNodeSettings = ({ node, setState, state }) => {
  return (
    <>
      {node.identity >= 100 ? (
        <div className='flex-row' style={{ marginTop: 24 }}>
          <Button
            icon={<MdAdd size={16} color='#9c9c9c' />}
            onClick={(e) => {
              setState({
                ...state,
                topNode: node,
                modal: 'add_sub_section',
              });
              e.stopPropagation();
            }}
          />
          <Button
            icon={<AiOutlineDelete size={16} color='#9c9c9c' />}
            onClick={(e) => {
              setState({
                ...state,
                deleteNode: node,
                modal: 'delete_page',
              });
              e.stopPropagation();
            }}
          />

          <Button
            icon={<MdOutlineEdit size={16} color='#9c9c9c' />}
            onClick={(e) => {
              setState({
                ...state,
                editNode: node,
                modal: 'edit_node',
              });
              e.stopPropagation();
            }}
          />

          <Button
            icon={<MdContentCopy size={16} color='#9c9c9c' />}
            onClick={(e) => {
              navigator.clipboard.writeText(node.body);
              e.stopPropagation();
            }}
          />
        </div>
      ) : null}
    </>
  );
};
