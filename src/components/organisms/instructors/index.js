// @packages
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import DataTable from "react-data-table-component";
import InstructorsModal from "@molecules/instructor-modal";

// @scripts
import TasksBar from "@molecules/task-bar";
import queryAllInstructors from "@graphql/QueryAllInstructors";
import queryAllTeamClassesByInstructor from "@graphql/QueryAllClasses";
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
  const [allInstructorSearchFiltersApply, setAllInstructorSearchFiltersApply] = useState([]);
  const [instructorDataToExport, setInstructorDataToExport] = useState(null);
  const [isModeEdit, setIsModeEdit] = useState(false);
  const [currentInstructor, setCurrentIntructor] = useState({});
  const [openModalInstructor, setOpenModalInstructor] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [isDeleteInstructorError, setIsDeleteInstructorError] = useState(false);
  const [isMutationError, setIsMutarionError] = useState(false);
  const [proccesing, setProccesing] = useState(false);
  const [teamClassesByInstructor, setTeamClassesByInstructor] = useState([]);
  const [searchInstructors, setSearchInstructors] = useState("");

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

  const [getClassesByInstructor] = useLazyQuery(queryAllTeamClassesByInstructor, {
    variables: {
      filter: {
        instructorId: currentInstructor._id
      }
    },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setTeamClassesByInstructor(data?.teamClasses || []);
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
      getClassesByInstructor();
    } else {
      setIsDeleteInstructorError(false);
      setIsMutarionError(false);
    }
  }, [openModalDelete, currentInstructor]);

  useEffect(() => {
    if (allInstructors) {
      const instructors = [...allInstructors];
      const instructorsArray = [];
      const headers = [
        "Id",
        "Name",
        "Email",
        "Phone",
        "Company",
        "Special Features",
        "Active"
      ];

      instructorsArray.push(headers);

      instructors.forEach((element) => {
        const row = [
          element._id,
          element.name,
          element.email,
          element.phone,
          element.company,
          element.specialFeatures?.invoicing.toString(),
          element.active.toString()
        ];
        instructorsArray.push(row);
      });
      setInstructorDataToExport(instructorsArray);
    }
  }, [allInstructors]);

  const getDataInstructorsToExport = () => instructorDataToExport;

  const handleDeleteInstructor = () => {
    if (!teamClassesByInstructor.length) {
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

  const columns = getColumns(
    handleModal,
    setIsModeEdit,
    setCurrentIntructor,
    handleModalDelete,
    updateIsActiveInstructor,
    proccesing
  );

  useEffect(() => {
    const instructorsFiltered = [...allInstructors] || [];
    setAllInstructorSearchFiltersApply(instructorsFiltered.filter((instructor) => (
      instructor?.name.toLowerCase().includes(searchInstructors.toLowerCase()) || 
      instructor?.email.toLowerCase().includes(searchInstructors.toLowerCase())
    )));
  }, [searchInstructors, allInstructors]);

  return (
    <>
      <Container>
        <TasksBar
          setElementToAdd={function () {}}
          titleView={"Instructors"}
          titleBadge={` ${allInstructorSearchFiltersApply.length} records found`}
          showAddModal={handleModal}
          getDataToExport={getDataInstructorsToExport}
          fileExportedName={"Instructors"}
          buttonTitle={"Add instructor"}
          isSearchFilter={true}
          searchValue={searchInstructors}
          setSearchValue={setSearchInstructors}
        />
        <DataTable
          columns={columns}
          data={allInstructorSearchFiltersApply}
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
            isDeletingGetError={isDeleteInstructorError}
            titleClasses={teamClassesByInstructor.map(({title}) => title)}
            isMutationError={isMutationError}
            proccesing={proccesing}
          />
        )}
      </Container>
    </>
  );
};

export default InstructorsList;
