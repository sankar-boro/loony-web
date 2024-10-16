import { MdClose } from 'react-icons/md';

export const ModalFull = ({ visible, children }: { children: React.ReactNode, visible: boolean }) => {
  if (!visible) {
    return null;
  }

  return <div className='modal-print'>{children}</div>;
};

export const CustomModal = ({ visible, children }: { children: React.ReactNode, visible: boolean }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className='modal-overlay'>
      <div className='modal'>{children}</div>
    </div>
  );
};

export const ModalMd = ({ visible, children, onClose, title }: { children: React.ReactNode, visible: boolean, onClose: React.MouseEventHandler<HTMLDivElement>, title: string }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-md'>
        <div className='modal-header'>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                wordWrap: 'break-word',
              }}
            >
              {title}
            </div>
            <div onClick={onClose} className='modal-close hover'>
              <MdClose size={16} className='close-icon' />
            </div>
          </div>
        </div>
        <div className='modal-body'>{children}</div>
      </div>
    </div>
  );
};

export const Modal = (
  { visible, children, onClose, title }
  : { children: React.ReactNode, visible: boolean, onClose: React.MouseEventHandler<HTMLDivElement>, title: string }
) => {
  if (!visible) {
    return null;
  }

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <div className='modal-header'>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                wordWrap: 'break-word',
              }}
            >
              {title}
            </div>
            <div onClick={onClose} className='modal-close hover'>
              <MdClose size={16} className='close-icon' />
            </div>
          </div>
        </div>
        <div className='modal-body'>{children}</div>
      </div>
    </div>
  );
};

export const ModalButtonContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: '14px 45px',
        backgroundColor: '#f4f4f4',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
      }}
    >
      {children}
    </div>
  );
};

export const ModalBodyContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        padding: '15px 45px',
      }}
    >
      {children}
    </div>
  );
};
