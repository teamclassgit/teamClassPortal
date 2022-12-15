// @packages
import { useState } from "react";
import { useQuery } from "@apollo/client";
import DataTable from "react-data-table-component";
import InstructorsModal from "@molecules/instructor-modal";

// @scripts
import TasksBar from "@molecules/task-bar";
import queryAllInstructors from "@graphql/QueryAllInstructors";
import { getColumns } from "./columns";
import { ChevronDown } from "react-feather";
import { Container } from "reactstrap";

// @styles
import "@styles/react/libs/tables/react-dataTable-component.scss";

const InstructorsList = () => {
  const [allInstructors, setAllInstructors] = useState([]);
  const [elementToAdd, setElementToAdd] = useState({});
  const [isModeEdit, setIsModeEdit] = useState(false);
  const [dataInstructor, setDataIntructor] = useState({});
  const [openModalInstructor, setOpenModalInstructor] = useState(false);

  const handleModal = () => setOpenModalInstructor(!openModalInstructor);

  useQuery(queryAllInstructors, {
    variables: { filter: {} },
    fetchPolicy: "cache-and-network",
    onCompleted: (instructorsResultData) => {
      setAllInstructors(instructorsResultData.instructors);
    }
  });

  const columns = getColumns(handleModal, setIsModeEdit, setDataIntructor);

  return (
    <>
      <Container>
        <TasksBar
          setElementToAdd={setElementToAdd}
          titleView={"Instructors"}
          titleBadge={` ${allInstructors.length} records found`}
          showAddModal={handleModal}
          // getDataToExport={getDataToExport}
        />
        <DataTable
          columns={columns}
          data={allInstructors}
          noHeader
          sortIcon={<ChevronDown size={10}/>}
          className="react-dataTable my-2"
        />
        {openModalInstructor && (
          <InstructorsModal
            open={openModalInstructor}
            isModeEdit={isModeEdit}
            handleModal={handleModal}
            setIsModeEdit={setIsModeEdit}
            data={isModeEdit ? dataInstructor : null}
          />
        )}

      </Container>
    </>
  );
};

export default InstructorsList;
