import React, { useEffect, useState, useContext } from 'react'
import { Modal, ModalHeader, ModalBody, FormGroup, InputGroup, Label, Input, Button } from 'reactstrap'
import { FiltersContext } from '../../../context/FiltersContext/FiltersContext'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'

function FiltersModal({ open, handleModal, classes, coordinators }) {
  const { classFilterContext, setClassFilterContext } = useContext(FiltersContext)
  const { coordinatorFilterContext, setCoordinatorFilterContext } = useContext(FiltersContext)
  const { dateFilterContext, setDateFilterContext } = useContext(FiltersContext)

  const [filterByClass, setFilterByClass] = useState(classFilterContext)
  const [filterByCoordinator, setFilterByCoordinator] = useState(coordinatorFilterContext)
  const [filterByDate, setFilterByDate] = useState(dateFilterContext)

  const classOptions = classes.map(({ title, _id }) => ({ value: _id, label: title }))
  const getClassFilterDefaultValue = () => {
    if (classFilterContext) {
      return classOptions.find((opt) => opt.value === classFilterContext.value)
    }
    return []
  }

  const coordinatorOptions = coordinators.map(({ name, _id }) => ({ value: _id, label: name }))
  const getCoordinatorFilterDefaultValue = () => {
    if (coordinatorFilterContext) {
      const values = coordinatorFilterContext.value
      return coordinatorOptions.filter((opt) => values && values.includes(opt.value))
    }

    return null
  }

  const handleApplyFilters = () => {
    setClassFilterContext(filterByClass && filterByClass.value ? filterByClass : null)
    setCoordinatorFilterContext(filterByCoordinator && filterByCoordinator.value && filterByCoordinator.value.length > 0 ? filterByCoordinator : null)
    setDateFilterContext(filterByDate && filterByDate.value ? filterByDate : null)
    handleModal()
  }

  const handleClearFilters = () => {
    setClassFilterContext(null)
    setCoordinatorFilterContext(null)
    setDateFilterContext(null)
    handleModal()
  }

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
          <Select
            defaultValue={getClassFilterDefaultValue()}
            options={classOptions}
            onChange={(e) => {
              setFilterByClass({ type: 'class', value: e.value, label: e.label })
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleSelect" className="text-dark">
            Filter by event coordinator
          </Label>
          <Select
            defaultValue={getCoordinatorFilterDefaultValue()}
            options={coordinatorOptions}
            onChange={(e) => {
              setFilterByCoordinator({ type: 'coordinator', value: e.map((element) => element.value), label: e.map((element) => element.label) })
            }}
            isMulti={true}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleSelect" className="text-dark">
            Filter by creation date
          </Label>
          <Flatpickr
            value={dateFilterContext && dateFilterContext.value}
            placeholder="Select Date Range..."
            id="range-picker"
            className="form-control"
            onChange={(dates) =>
              setFilterByDate({
                type: 'date',
                value: dates
              })
            }
            options={{
              mode: 'range'
            }}
          />
        </FormGroup>
      </ModalBody>
    </Modal>
  )
}

export default FiltersModal
