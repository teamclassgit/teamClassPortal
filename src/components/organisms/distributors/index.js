// @packages
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import DataTable from "react-data-table-component";
import { Container } from "reactstrap";
import { ChevronDown } from "react-feather";

// @scripts
import TasksBar from "@molecules/task-bar";
import QueryAllDistributors from "@graphql/QueryAllDistributors";
import queryAllTeamClassesByDistributor from "@graphql/QueryAllClasses";
import DistributorsModal from "@molecules/distributor-modal";
import { getColumns } from "./columns";
import ModalDeleteConfirmation from "@molecules/modal-delete-confirmation";
import mutationDeleteOneDistributor from "@graphql/MutationDeleteOneDistributor";
import mutationUpdateActiveDistributor from "@graphql/MutationUpdateActiveDistributor";

// @styles
import "@styles/react/libs/tables/react-dataTable-component.scss";

const DistributorsList = () => {
  const [allDistributors, setAllDistributors] = useState([]);
  const [allDistributorSearchFiltersApply, setAllDistributorSearchFiltersApply] = useState([]);
  const [distributorDataToExport, setDistributorDataToExport] = useState(null);
  const [isModeEdit, setIsModeEdit] = useState(false);
  const [currentDistributor, setCurrentDistributor] = useState({});
  const [openModalDistributor, setOpenModalDistributor] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [isDeleteDistributorError, setIsDeleteDistributorError] = useState(false);
  const [isMutationError, setIsMutarionError] = useState(false);
  const [proccesing, setProccesing] = useState(false);
  const [teamClassesByDistributor, setTeamClassesByDistributor] = useState([]);
  const [searchDistributors, setSearchDistributors] = useState("");

  const handleModal = () => setOpenModalDistributor(!openModalDistributor);
  const handleModalDelete = () => setOpenModalDelete(!openModalDelete);

  const [updateActiveDistributor] = useMutation(mutationUpdateActiveDistributor);
  const [deleteOneDistributor] = useMutation(mutationDeleteOneDistributor);

  useQuery(QueryAllDistributors, {
    variables: { filter: {} },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setAllDistributors(data.distributors || []);
    }
  });

  const [getClassesByDistributor] = useLazyQuery(queryAllTeamClassesByDistributor, {
    variables: {
      filter: {
        distributorId: currentDistributor._id
      }
    },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setTeamClassesByDistributor(data?.teamClasses || []);
    }
  });

  const deleteDistributor = async () => {
    setProccesing(true);
    try {
      const results = await deleteOneDistributor({
        variables: {
          id: currentDistributor._id
        }
      });
      if (results) {
        setAllDistributors(allDistributors.filter(({_id}) => _id !== currentDistributor._id));
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
      getClassesByDistributor();
    } else {
      setIsDeleteDistributorError(false);
      setIsMutarionError(false);
    }
  }, [openModalDelete, currentDistributor]);

  useEffect(() => {
    if (allDistributors) {
      const distributors = [...allDistributors];
      const distributorsArray = [];
      const headers = [
        "Id",
        "Name",
        "Email",
        "Phone",
        "Company",
        "Special Features",
        "Active"
      ];

      distributorsArray.push(headers);

      distributors.forEach((element) => {
        const row = [
          element._id,
          element.name,
          element.email,
          element.phone,
          element.company,
          element.specialFeatures?.invoicing.toString(),
          element.active.toString()
        ];
        distributorsArray.push(row);
      });
      setDistributorDataToExport(distributorsArray);
    }
  }, [allDistributors]);

  const getDataDistributorsToExport = () => distributorDataToExport;

  const handleDeleteDistributor = () => {
    if (!teamClassesByDistributor.length) {
      deleteDistributor();
      return;
    }
    setIsDeleteDistributorError(true);
  };

  const updateIsActiveDistributor = async (isActive, distributorId) => {
    setProccesing(true);
    await updateActiveDistributor({
      variables: {
        id: distributorId,
        active: isActive
      },
      optimisticResponse: {
        updateActiveDistributor: {
          id: distributorId,
          __typename:"distributor",
          active: isActive
        }
      }
    });
    setProccesing(false);
  };

  const columns = getColumns(
    handleModal,
    setIsModeEdit,
    setCurrentDistributor,
    handleModalDelete,
    updateIsActiveDistributor,
    proccesing
  );

  useEffect(() => {
    const distributorsFiltered = [...allDistributors] || [];
    setAllDistributorSearchFiltersApply(distributorsFiltered.filter((instructor) => (
      instructor?.name.toLowerCase().includes(searchDistributors.toLowerCase()) || 
      instructor?.email.toLowerCase().includes(searchDistributors.toLowerCase())
    )));
  }, [searchDistributors, allDistributors]);

  return (
    <>
      <Container>
        <TasksBar
          setElementToAdd={function () {}}
          titleView={"Distributors"}
          titleBadge={` ${allDistributorSearchFiltersApply.length} records found`}
          showAddModal={handleModal}
          getDataToExport={getDataDistributorsToExport}
          fileExportedName={"Distributors"}
          buttonTitle={"Add distributor"}
          isSearchFilter={true}
          searchValue={searchDistributors}
          setSearchValue={setSearchDistributors}
        />
        <DataTable
          columns={columns}
          data={allDistributorSearchFiltersApply}
          noHeader
          sortIcon={<ChevronDown size={10}/>}
          className="react-dataTable my-2"
        />
        {openModalDistributor && (
          <DistributorsModal
            open={openModalDistributor}
            isModeEdit={isModeEdit}
            handleModal={handleModal}
            setIsModeEdit={setIsModeEdit}
            data={isModeEdit ? currentDistributor : null}
          />
        )}
        {openModalDelete && (
          <ModalDeleteConfirmation
            isOpenModalDelete={openModalDelete}
            toggleModalDelete={handleModalDelete}
            handleDeleteItem={handleDeleteDistributor}
            isDeletingGetError={isDeleteDistributorError}
            titleClasses={teamClassesByDistributor.map(({title}) => title)}
            isMutationError={isMutationError}
            proccesing={proccesing}
            itemName="Distributor"
          />
        )}
      </Container>
    </>
  );
};

export default DistributorsList;
