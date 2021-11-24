// ** React Imports
import React, { useState } from 'react';
import readXlsxFile, { Email } from 'read-excel-file';
import { X } from 'react-feather';
import { Alert, Button, Card, CardBody, CardHeader, CardTitle, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Uppy from '@uppy/core';
import { DragDrop } from '@uppy/react';
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss';
import 'uppy/dist/uppy.css';
import '@uppy/status-bar/dist/style.css';
import '@styles/react/libs/file-uploader/file-uploader.scss';
import { v4 as uuid } from 'uuid';

const UploadData = ({ open, handleModal, currentBookingId, saveAttendee, data, setData, updateAttendeesCount, teamClassInfo }) => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [processing, setProcessing] = React.useState(false);

  const save = async () => {
    try {
      setProcessing(true);

      let newData = data.map((element) => element);

      for (let i = 0; i < fileData.length; i++) {
        const result = newData.find(
          (element) => element.email && fileData[i].email && element.email.toLowerCase() === fileData[i].email.toLowerCase()
        );

        if (result && result._id) {
          fileData[i].id = result._id;
          newData = newData.filter((element) => element._id !== result._id);
        } else fileData[i].id = uuid();

        const { id, bookingId, name, addressLine1, addressLine2, city, state, zip, country, email, phone } = fileData[i];
        const newAttendee = { id, bookingId, name, addressLine1, addressLine2, city, state, zip, country, email, phone, additionalFields: [] };
        for (const dynamicField in teamClassInfo.registrationFields) {
          newAttendee.additionalFields.push({
            name: teamClassInfo.registrationFields[dynamicField].label,
            order: teamClassInfo.registrationFields[dynamicField].order,
            value: fileData[i][teamClassInfo.registrationFields[dynamicField].label] || ''
          });
        }
        const row = await saveAttendee(newAttendee);
        newData.push(row);
      }

      setData(newData);
      updateAttendeesCount(newData.length);

      setProcessing(false);
      setFile(null);
      setFileData([]);
      setErrors([]);

      handleModal();
    } catch (ex) {
      console.log(ex);
      setProcessing(false);
    }
  };

  const cancel = () => {
    handleModal();
    setFile(null);
    setFileData([]);
    setErrors([]);
  };

  // ** Custom close btn
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />;

  const uppy = new Uppy({
    meta: { type: 'avatar' },
    restrictions: { maxNumberOfFiles: 1, allowedFileTypes: ['.xlsx'] },
    autoProceed: true
  });

  const schema = {
    Name: {
      prop: 'name',
      type: String,
      required: true
    },
    Email: {
      prop: 'email',
      type: Email,
      required: true
    },

    Phone: {
      prop: 'phone',
      type: String,
      required: false
    },
    AddressLine1: {
      prop: 'addressLine1',
      type: String,
      required: false
    },
    AddressLine2: {
      prop: 'addressLine2',
      type: String,
      required: false
    },
    City: {
      prop: 'city',
      type: String,
      required: false
    },
    State: {
      prop: 'state',
      type: String,
      required: false
    },
    Zip: {
      prop: 'zip',
      type: String,
      required: false
    },
    Country: {
      prop: 'country',
      type: String,
      required: false
    }
  };

  for (const dynamicField in teamClassInfo.registrationFields) {
    Object.assign(schema, {
      [teamClassInfo.registrationFields[dynamicField].label]: {
        prop: teamClassInfo.registrationFields[dynamicField].label
      }
    });
  }

  uppy.on('complete', (result) => {
    if (result && result.successful && result.successful.length > 0) {
      setFile(result.successful[0].data);
      readXlsxFile(result.successful[0].data, { schema }).then((rows) => {
        setErrors(rows.errors);
        setFileData(
          rows.rows.map((element) => {
            if (element.phone) {
              element.phone = element.phone.toString();
            }

            if (element.zip) {
              element.zip = element.zip.toString();
            }

            return { ...element, bookingId: currentBookingId };
          })
        );
      });
    }
  });

  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader className="mb-3" toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">Upload data</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <Card>
          <CardHeader>
            <CardTitle tag="h4"> Attendees file </CardTitle>
          </CardHeader>
          <CardBody>
            <DragDrop uppy={uppy} />
            {file && <span>{file.name}</span>}
            {file && fileData && errors && (
              <Alert color="primary" isOpen={true}>
                <div className="alert-body">
                  <span>
                    <small>ProTip: Your file should match our template's structure</small>
                    <br />
                    Number of rows: {fileData.length}
                    <br />
                    Errors: {errors.length}
                    <br />
                  </span>
                  {errors.length > 0 && (
                    <textarea
                      className="form-control"
                      value={errors.map(({ row, column, error, value }) => `Row ${row} (${column}): ${error} ${value} `)}
                    ></textarea>
                  )}
                </div>
              </Alert>
            )}
          </CardBody>
        </Card>

        <Button className="mr-1" color="primary" onClick={save} disabled={processing || !file || !fileData || (errors && errors.length > 0)}>
          {processing ? 'Loading...' : 'Load'}
        </Button>
        <Button color="secondary" onClick={cancel} outline disabled={processing}>
          Cancel
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default UploadData;
