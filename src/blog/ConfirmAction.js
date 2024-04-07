import { Modal, ModalBodyContainer, ModalButtonContainer } from '../components';

const ConfirmAction = ({ onClose, title, confirmTitle, confirmAction }) => {
  return (
    <Modal visible={true} onClose={onClose} title={title}>
      <ModalBodyContainer>{confirmTitle}</ModalBodyContainer>
      <ModalButtonContainer>
        <button onClick={confirmAction} className='black-bg'>
          Confirm
        </button>
      </ModalButtonContainer>
    </Modal>
  );
};

export default ConfirmAction;
