// @packages
import { Edit, Trash2 } from "react-feather";
import { CustomInput } from "reactstrap";

export const getColumns = (
  handleModal,
  setIsModeEdit,
  setCurrentCoordinator,
  handleModalDelete,
  processingRouting,
  bookingRoutingEventCoordinators,
  updateBookingRoutingEventCoordinators,
  processingLargeEventRouting,
  updateBookingRoutingEventCoordinatorsLargeEvents,
  updateLargeEventsCoodinator,
  bookingRoutingEventCoordinatorsLargeEvents
) => {
  const columns = [
    {
      name: "NAME",
      selector: row => row.name,
      sortable: true
    },
    {
      name: "EMAIL",
      selector: row => row.email,
      sortable: true
    },
    {
      name: "DEFAULT?",
      selector: "default",
      cell: (row) => (
        <span>{row.default ? "Yes" : "No"}</span>
      )
    },
    {
      name: "ROUTING?",
      selector: "routing",
      cell: (row) => (
        <CustomInput
          id={row._id}
          type="switch"
          checked={
            bookingRoutingEventCoordinators &&
            bookingRoutingEventCoordinators.includes(row._id)
          }
          onChange={(e) => {
            updateBookingRoutingEventCoordinators(e.target.checked, row._id);
          }}
          disabled={processingRouting}
        >
          <span>{bookingRoutingEventCoordinators.includes(row._id) ? "Yes" : "No"}</span>
        </CustomInput>
      )
    },
    {
      name: "LARGE EVENT ROUTING?",
      selector: "largeEventRouting",
      cell: (row) => (
        <CustomInput
          id={`${row._id}largeEventRouting`}
          type="switch"
          checked={
            bookingRoutingEventCoordinatorsLargeEvents &&
            bookingRoutingEventCoordinatorsLargeEvents.includes(row._id)
          }
          onChange={(e) => {
            updateBookingRoutingEventCoordinatorsLargeEvents(e.target.checked, row._id);
            updateLargeEventsCoodinator(e.target.checked, row._id);
          }}
          disabled={processingLargeEventRouting}
        >
          <span>{bookingRoutingEventCoordinatorsLargeEvents.includes(row._id) ? "Yes" : "No"}</span>
        </CustomInput>
      )
    },
    {
      name: "",
      selector: "edit",
      cell: (row) => (
        <>
          <Trash2
            className="cursor-pointer mr-1"
            size={20}
            onClick={() => {
              setCurrentCoordinator(row);
              handleModalDelete();
            }}
          />
          <Edit
            className="cursor-pointer"
            size={20}
            onClick={() => {
              setIsModeEdit(true);
              setCurrentCoordinator(row);
              handleModal();
            }}
          />
        </>
      )
    }
  ];

  return columns;
};