// @packages
import { Edit, Trash2 } from "react-feather";
import { CustomInput } from "reactstrap";

export const getColumns = (handleModal, setIsModeEdit, setCurrentCoordinator, handleModalDelete, proccesing) => {
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
      selector: "active",
      cell: (row) => (
        <span>{row.active ? "Yes" : "No"}</span>
      )
    },
    {
      name: "ROUTING?",
      selector: "routing",
      cell: (row) => (
        <CustomInput
          id={row._id}
          type="switch"
          checked={false}
          // onChange={(e) => updateIsActiveInstructor(e.target.checked, row._id)}
          disabled={proccesing}
        >
          <span>{row.active ? "Yes" : "No"}</span>
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