// @packages
import { useState } from 'react';
import Uppy from '@uppy/core';
import thumbnailGenerator from '@uppy/thumbnail-generator';
import { DragDrop } from '@uppy/react';
import { Button, Card, CardHeader, CardTitle, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { X } from 'react-feather';

// @styles
import './drop-zone.scss';

const DropZone = ({ dropText, attachedFile, setAttachedFile, fileUrl }) => {
  const [showModal, setShowModal] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(null);

  const uppy = new Uppy({
    meta: { type: 'avatar' },
    autoProceed: true,
    restrictions: {
      maxNumberOfFiles: 1
    }
  });

  uppy.setOptions({
    restrictions: {
      maxNumberOfFiles: 1
    }
  });

  uppy.use(thumbnailGenerator);

  uppy.on('complete', (file) => {
    const arr = attachedFile;
    arr.push(file);
    setAttachedFile([...arr]);
  });

  const renderPreview = () => {
    if (attachedFile.length) {
      return attachedFile.map((item, index) => item.successful.map((item2) => (
          <ul key={index} className="list-unstyled">
            <li className="mt-2">
              <a href={fileUrl} target="_blank">
                {item2.type === 'application/pdf' ? (
                  <img src="https://www.comfatolima.com.co/wp-content/uploads/2018/10/icon-pdf.png" width="35px" height="20px" alt="pdf-icon" />
                ) : (
                  <img src="https://sm.pcmag.com/pcmag_au/review/m/microsoft-/microsoft-photos_aguw.jpg" width="40px" height="20px" alt="pdf-icon" />
                )}
                {item2.data.name}{' '}
                <a
                  onClick={(e) => {
                    setRemoveIndex(index);
                    setShowModal(!showModal);
                  }}
                  title="Remove"
                >
                  <X className="file-remove-icon" />
                </a>
              </a>
            </li>
          </ul>
        ))
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)} className="modal-dialog-centered">
        <ModalHeader
          toggle={() => {
            setShowModal(!showModal);
          }}
        >
          Remove file?
        </ModalHeader>
        <ModalBody>
          <div className="d-flex justify-content-center">
            <Button
              onClick={(e) => {
                const newAttachedFile = [...attachedFile];
                newAttachedFile.splice(removeIndex, 1);
                setAttachedFile(newAttachedFile);
                setShowModal(!showModal);
              }}
            >
              Yes
            </Button>
          </div>
        </ModalBody>
      </Modal>
      <Card className="mt-2">
        <CardHeader>
          <CardTitle tag="h4"> {dropText}</CardTitle>
        </CardHeader>
        <CardBody>
          <DragDrop uppy={uppy} />
          {renderPreview()}
        </CardBody>
      </Card>
    </div>
  );
};

export default DropZone;
