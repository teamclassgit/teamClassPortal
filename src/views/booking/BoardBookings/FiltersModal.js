import React, { useEffect } from 'react'
import { Modal, ModalHeader, ModalBody, FormGroup, Label, Input } from 'reactstrap'
import Select from 'react-select'
import { handleInputChange } from 'react-select/src/utils'

function FiltersModal({ open, handleModal, classes, onFilterUpdate }) {
  const [filterBy, setFilterBy] = useState({
    type: null,
    value: null
  })

  useEffect(() => {
    onFilterUpdate(filterBy)
  }, [filterBy])

  const classOptions = classes.map(({ title, id }) => ({ value: id, label: title }))

  const handleInputChange = (type, value) => setFilterBy({ type, value })

  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader className="" toggle={handleModal} tag="div">
        <h5 className="modal-title mt-1">Filter opportunities</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1 mt-2">
        <FormGroup>
          <Label for="exampleSelect" className="text-dark">
            Filter by class
          </Label>
          <Input type="select" name="select" id="exampleSelect"></Input>
          {/* <Select defaultValue={classOptions[1]} options={classOptions} onChange={(e) => handleInputChange('class', e.value)} /> */}
        </FormGroup>
      </ModalBody>
    </Modal>
  )
}

export default FiltersModal
