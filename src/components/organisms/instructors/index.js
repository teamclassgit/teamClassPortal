// @packages
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import DataTable from "react-data-table-component";
import InstructorsModal from "@molecules/instructor-modal";

// @scripts
import TasksBar from "@molecules/task-bar";
import queryAllInstructors from "@graphql/QueryAllInstructors";
import queryAllTeamClasses from "@graphql/QueryAllClasses";
import { getColumns } from "./columns";
import { ChevronDown } from "react-feather";
import { Container } from "reactstrap";
import ModalDeleteConfirmation from "@molecules/modal-delete-confirmation";
import mutationDeleteOneInstructor from "@graphql/MutationDeleteOneInstructor";
import mutationUpdateActiveInstructor from "@graphql/MutationUpdateActiveInstructor";

// @styles
import "@styles/react/libs/tables/react-dataTable-component.scss";

const InstructorsList = () => {
  const [allInstructors, setAllInstructors] = useState([]);
  const [elementToAdd, setElementToAdd] = useState({});
  const [isModeEdit, setIsModeEdit] = useState(false);
  const [currentInstructor, setCurrentIntructor] = useState({});
  const [allTeamClassesData, setAllTeamClassData] = useState([]);
  const [openModalInstructor, setOpenModalInstructor] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [isDeleteInstructorError, setIsDeleteInstructorError] = useState(false);
  const [isMutationError, setIsMutarionError] = useState(false);
  const [proccesing, setProccesing] = useState(false);
  const [teamClassesByInstructor, setTeamClassesByInstructor] = useState(false);

  const handleModal = () => setOpenModalInstructor(!openModalInstructor);
  const handleModalDelete = () => setOpenModalDelete(!openModalDelete);
  const [updateActiveInstructor] = useMutation(mutationUpdateActiveInstructor);

  const [deleteOneInstructor] = useMutation(mutationDeleteOneInstructor);

  useQuery(queryAllInstructors, {
    variables: { filter: {} },
    fetchPolicy: "cache-and-network",
    onCompleted: (instructorsResultData) => {
      setAllInstructors(instructorsResultData.instructors);
    }
  });

  useQuery(queryAllTeamClasses, {
    variables: {
      filter: {}
    },
    fetchPolicy: "cache-and-network",
    onCompleted: (teamClassInstructorIdResultData) => {
      setAllTeamClassData(teamClassInstructorIdResultData.teamClasses);
    }
  });

  const deleteInstructor = async () => {
    setProccesing(true);
    try {
      const results = await deleteOneInstructor({
        variables: {
          id: currentInstructor._id
        }
      });
      if (results) {
        setAllInstructors(allInstructors.filter(({_id}) => _id !== currentInstructor._id));
      }
      handleModalDelete();
    } catch (ex) {
      setIsMutarionError(true);
      console.log("Something went wrong. Please try again", ex);
    }
    setProccesing(false);
  };

  useEffect(() => {
    if (openModalDelete) {
      setTeamClassesByInstructor(allTeamClassesData && allTeamClassesData.filter(({ instructorId }) => (
        instructorId === currentInstructor._id)
      ).map(({title}) => title));
    } else {
      setIsDeleteInstructorError(false);
      setIsMutarionError(false);
    }
  }, [openModalDelete, currentInstructor]);

  const handleDeleteInstructor = () => {
    if (!allTeamClassesData.map(({instructorId}) => instructorId).includes(currentInstructor._id)) {
      deleteInstructor();
      return;
    }
    setIsDeleteInstructorError(true);
  };

  const updateIsActiveInstructor = async (isActive, instructorId) => {
    setProccesing(true);
    await updateActiveInstructor({
      variables: {
        id: instructorId,
        active: isActive
      },
      optimisticResponse: {
        updateActiveInstructor: {
          id: instructorId,
          __typename:"Instructor",
          active: isActive
        }
      }
    });
    setProccesing(false);
  };

  const columns = getColumns(handleModal, setIsModeEdit, setCurrentIntructor, handleModalDelete, updateIsActiveInstructor, proccesing);


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
            data={isModeEdit ? currentInstructor : null}
          />
        )}
        {openModalDelete && (
          <ModalDeleteConfirmation
            isOpenModalDelete={openModalDelete}
            toggleModalDelete={handleModalDelete}
            handleDeleteItem={handleDeleteInstructor}
            isDeleteInstructorError={isDeleteInstructorError}
            titleClasses={teamClassesByInstructor}
            isMutationError={isMutationError}
            proccesing={proccesing}
          />
        )}
      </Container>
    </>
  );
};

export default InstructorsList;
