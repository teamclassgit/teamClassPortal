// @packages
import { Edit, Trash2 } from "react-feather";
import { CustomInput } from "reactstrap";

export const getColumns = (handleModal, setIsModeEdit, setCurrentIntructor, handleModalDelete, updateIsActiveInstructor, proccesing) => {
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
      name: "PHONE",
      selector: row => row.phone
    },
    {
      name: "COMPANY",
      selector: row => row.company,
      sortable: true
    },
    {
      name: "ACTIVE",
      selector: "active",
      cell: (row) => (
        <CustomInput
          id={row._id}
          type="switch"
          checked={row.active}
          onChange={(e) => updateIsActiveInstructor(e.target.checked, row._id)}
          disabled={proccesing}
        >
          Active
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
              setCurrentIntructor(row);
              handleModalDelete();
            }}
          />
          <Edit
            className="cursor-pointer"
            size={20}
            onClick={() => {
              setIsModeEdit(true);
              setCurrentIntructor(row);
              handleModal();
            }}
          />
        </>
      )
    }
  ];

  return columns;
};