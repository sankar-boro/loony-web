import {
  Modal,
  ModalBodyContainer,
  ModalButtonContainer,
} from '../components/index.tsx'

const ConfirmAction = ({
  title,
  confirmTitle,
  confirmAction,
  onCancel,
}: {
  confirmTitle: string
  confirmAction: React.MouseEventHandler<HTMLButtonElement>
  title: string
  onCancel:
    | React.MouseEventHandler<HTMLButtonElement>
    | React.MouseEventHandler<HTMLDivElement>
}) => {
  return (
    <Modal
      visible={true}
      onClose={onCancel as React.MouseEventHandler<HTMLDivElement>}
      title={title}
    >
      <ModalBodyContainer>{confirmTitle}</ModalBodyContainer>
      <ModalButtonContainer>
        <button
          onClick={onCancel as React.MouseEventHandler<HTMLButtonElement>}
          className="white-bg shadow"
          style={{ marginRight: 10 }}
        >
          Cancel
        </button>
        <button onClick={confirmAction} className="black-bg shadow">
          Confirm
        </button>
      </ModalButtonContainer>
    </Modal>
  )
}

export default ConfirmAction
