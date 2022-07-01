import React from 'react';
import {Modal, Button} from 'react-bootstrap';  

class ConfirmModal extends React.Component {
    render(){
        const { show, handleClose, heading, handleOk } = this.props;  
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{heading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleOk.bind(this, heading)}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ConfirmModal