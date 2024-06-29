import Modal, { ModalProps } from 'react-bootstrap/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMultiply } from '@fortawesome/free-solid-svg-icons'
import { CSSProperties } from 'react'

export interface StandardModalProps extends ModalProps {
  handleClose: () => void
  bodyStyle?: CSSProperties
}

interface _StandardModalProps extends StandardModalProps {
  title: string
}

const StandardModal = (props: _StandardModalProps) => {
  const { title, handleClose, bodyStyle, children, ...otherProps } = props
  return (
    <Modal onHide={handleClose} {...otherProps}>
      <Modal.Header>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 className="m-0">{title}</h3>
          <FontAwesomeIcon
            icon={faMultiply}
            size="2x"
            className="icon-button"
            onClick={() => {
              handleClose()
            }}
          />
        </div>
      </Modal.Header>
      <Modal.Body style={bodyStyle}>{children}</Modal.Body>
    </Modal>
  )
}

export default StandardModal
