import React, { useEffect, useState, useContext } from 'react'
import { Modal, ModalHeader, ModalBody, FormGroup, Label, Input, Button } from 'reactstrap'
import { FiltersContext } from '../../../context/FiltersContext/FiltersContext'
import Select from 'react-select'

function FiltersModal({ open, handleModal, classes }) {
  const { classFilterContext, setClassFilterContext } = useContext(FiltersContext)
  const [filterBy, setFilterBy] = useState({
    type: null,
    value: null
  })
  const classOptions = classes.map(({ title, _id }) => ({ value: _id, label: title }))
  const getClassFilterDefaultValue = () => {
    if (classFilterContext) {
      return classOptions.filter((opt) => opt.value === classFilterContext.value)[0]
    }
    return classOptions[0]
  }

  const handleApplyFilters = () => {
    setClassFilterContext(filterBy)
    handleModal()
  }

  const handleClearFilters = () => {
    setClassFilterContext(null)
    handleModal()
  }

  const handleInputChange = (type, value) => setFilterBy({ type, value })

  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader className="" toggle={handleModal} tag="div">
        <h5 className="modal-title mt-1">Filter opportunities</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1 mt-2">
        <Button color="link" className="pl-0" onClick={() => handleApplyFilters()}>
          Apply filters
        </Button>
        <Button color="link" className="pl-0 float-right" onClick={() => handleClearFilters()}>
          Clear filters
        </Button>
        <FormGroup>
          <Label for="exampleSelect" className="text-dark mt-2">
            Filter by class
          </Label>
          <Select defaultValue={getClassFilterDefaultValue()} options={classOptions} onChange={(e) => handleInputChange('class', e.value)} />
        </FormGroup>
      </ModalBody>
    </Modal>
  )
}

export default FiltersModal
