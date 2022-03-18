// @packages
import { useState } from 'react';
import Uppy from '@uppy/core';
import thumbnailGenerator from '@uppy/thumbnail-generator';
import { DragDrop } from '@uppy/react';
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';

// @styles
import './drop-zone.scss';

const DropZone = ({ dropText }) => {
  const [previewArr, setPreviewArr] = useState([]);

  const uppy = new Uppy({
    meta: { type: 'avatar' },
    autoProceed: true
  });

  uppy.use(thumbnailGenerator);

  uppy.on('thumbnail:generated', (file, preview) => {
    const arr = previewArr;
    arr.push(preview);
    setPreviewArr([...arr]);
  });

  const renderPreview = () => {
    if (previewArr.length) {
      return previewArr.map((src, index) => <img key={index} className="rounded mt-2 mr-1" src={src} alt="avatar" />);
    } else {
      return null;
    }
  };

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
