import Modal, { ModalProps } from 'react-bootstrap/Modal'


export interface StandardModalProps extends ModalProps {
    handleClose: () => any
}


const StandardModal = (props: StandardModalProps) => {
    const { handleClose, children, ...otherProps } = props
    return <Modal onHide={handleClose} {...otherProps}>
        {children}
    </Modal>
}


export default StandardModal
