import { MdClose } from 'react-icons/md'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'
import CustomSpinner from './Spinner.tsx'
import { JsonObject, Alert } from 'loony-types'

const alertTypes: JsonObject = {
  success: {
    backgroundColor: '#DEF2D6',
    color: 'green',
  },
  error: {
    backgroundColor: '#ffcfcf',
    color: '#ba0000',
  },
  request: {
    backgroundColor: 'orange',
    color: 'white',
  },
}

const alertIcons: JsonObject = {
  success: <FaCircleCheck color="green" size={40} />,
  error: <FaCircleXmark color="#ba0000" size={40} />,
  request: <CustomSpinner color="#fff" />,
}

const AlertComponent = ({
  alert,
  onClose,
}: {
  alert: Alert
  onClose: React.MouseEventHandler<HTMLDivElement>
}) => {
  if (!alert) return null
  const css = alertTypes[alert.status]
  return (
    <div
      style={{
        position: 'fixed',
        right: 20,
        top: 20,
        zIndex: 1001,
        flex: 1,
      }}
    >
      <div
        style={{
          ...css,
          width: 350,
          boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.2)',
          borderRadius: 5,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 15,
            paddingBottom: 15,
          }}
        >
          <div
            style={{ width: '20%', display: 'flex', justifyContent: 'center' }}
          >
            <div style={{ width: '50%' }} className="buttonIcon">
              {alertIcons[alert.status]}
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <div style={{ fontSize: 20 }}>{alert.title}</div>
            <div style={{ fontSize: 14, paddingTop: 5 }}>{alert.content}</div>
          </div>
          <div
            onClick={onClose}
            style={{ width: '20%', display: 'flex', justifyContent: 'center' }}
          >
            <div style={{ width: '50%' }} className="buttonIcon">
              <MdClose />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertComponent
