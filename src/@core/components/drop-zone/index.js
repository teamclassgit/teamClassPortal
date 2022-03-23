// @packages
import { useState } from 'react';
import Uppy from '@uppy/core';
import thumbnailGenerator from '@uppy/thumbnail-generator';
import { DragDrop } from '@uppy/react';
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';

// @styles
import './drop-zone.scss';

const DropZone = ({ dropText, previewArr, setPreviewArr, fileUrl }) => {
  const uppy = new Uppy({
    meta: { type: 'avatar' },
    autoProceed: true
  });

  uppy.use(thumbnailGenerator);

  uppy.on('complete', (file) => {
    const arr = previewArr;
    arr.push(file);
    setPreviewArr([...arr]);
  });

  const renderPreview = () => {
    if (previewArr.length) {
      return previewArr.map((item, index) => item.successful.map((item2) => (
          <ul className="list-unstyled">
            <li className="mt-2">
              <a href={fileUrl} target="_blank">
                {item2.type === 'application/pdf' ? (
                  <img src="https://www.comfatolima.com.co/wp-content/uploads/2018/10/icon-pdf.png" width="35px" height="20px" alt="pdf-icon" />
                ) : (
                  <img src="https://sm.pcmag.com/pcmag_au/review/m/microsoft-/microsoft-photos_aguw.jpg" width="40px" height="20px" alt="pdf-icon" />
                )}
                {item2.data.name}
              </a>
            </li>
          </ul>
        ))
      );
    } else {
      return null;
    }
  };

  // console.log('previewArr', previewArr);

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle tag="h4"> {dropText}</CardTitle>
      </CardHeader>
      <CardBody>
        <DragDrop uppy={uppy} />
        {renderPreview()}
      </CardBody>
    </Card>
  );
};

export default DropZone;
