import { Modal, ModalBodyContainer, ModalButtonContainer } from '../components';

const ConfirmAction = ({ title, confirmTitle, confirmAction, setModal }) => {
  const onClose = () => {
    setModal('');
  };
  return (
    <Modal visible={true} onClose={onClose} title={title}>
      <ModalBodyContainer>{confirmTitle}</ModalBodyContainer>
      <ModalButtonContainer>
        <button onClick={onClose} className='grey-bg'>
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
