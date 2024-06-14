import { Modal, ModalBodyContainer, ModalButtonContainer } from '../components';

const ConfirmAction = ({ title, confirmTitle, confirmAction, onCancel }) => {
  return (
    <Modal visible={true} onClose={onCancel} title={title}>
      <ModalBodyContainer>{confirmTitle}</ModalBodyContainer>
      <ModalButtonContainer>
        <button onClick={onCancel} className='grey-bg'>
          Cancel
        </button>
        <button onClick={confirmAction} className='black-bg'>
          Confirm
        </button>
      </ModalButtonContainer>
    </Modal>
  );
};

export default ConfirmAction;
