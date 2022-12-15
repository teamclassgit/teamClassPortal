// @packages
import { Edit, Trash2 } from "react-feather";
import { CustomInput } from "reactstrap";

export const getColumns = (handleModal, setIsModeEdit, setDataIntructor) => {
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
      cell: (row) => <CustomInput type="switch" id="active" value={row.active}>Active</CustomInput>
    },
    {
      name: "EDIT",
      selector: "edit",
      cell: (row) => (
        <>
        <Trash2 className="cursor-pointer mr-1" size={20}/>
        <Edit
          className="cursor-pointer"
          size={20}
          onClick={() => {
            setIsModeEdit(true);
            setDataIntructor(row);
            handleModal();
          }}
        />
        </>
      )
    }
  ];

  return columns;
};