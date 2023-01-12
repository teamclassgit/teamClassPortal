// @packages
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { Container } from "reactstrap";
import DataTable from "react-data-table-component";

// @scripts
import { getColumns } from "./columns";
import QueryAllCoordinators from "@graphql/QueryAllEventCoordinators";
import TasksBar from "@molecules/task-bar";
import CoordinatorsModal from "@molecules/coordinators-modal";
import mutationDeleteOneCoordinator from "@graphql/MutationDeleteOneCoordinator";
import ModalDeleteConfirmation from "@molecules/modal-delete-confirmation";
import mutationUpdateLargeEventCoordinator from "@graphql/MutationUpdateCoordinator";
import queryAllBookingsByCoordinator from "@graphql/QueryGetBookingsWithCriteria";
import QueryBookingRouting from "@graphql/QueryBookingRouting";
import mutationUpdateBookingRouting from "@graphql/MutationUpdateBookingRouting";

// @styles
import "@styles/react/libs/tables/react-dataTable-component.scss";

const CoordinatorsList = () => {
  const [openModalCoordinator, setOpenModalCoordinator] = useState(false);
  const [currentCoordinator, setCurrentCoordinator] = useState({});
  const [isModeEdit, setIsModeEdit] = useState(false);
  const [allCoordinators, setAllCoordinators] = useState([]);
  const [allCoordinatorSearchFiltersApply, setAllCoordinatorSearchFiltersApply] = useState([]);
  const [searchCoordinators, setSearchCoordinators] = useState("");
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [coordinatorsDataToExport, setCoordinatorsDataToExport] = useState([]);
  const [proccesing, setProccesing] = useState(false);
  const [isMutationError, setIsMutarionError] = useState(false);
  const [processingRouting, setProcessingRouting] = useState(false);
  const [bookingRoutingEventCoordinators, setBookingRoutingEventCoordinators] = useState([]);
  const [processingLargeEventRouting, setProcessingLargeEventRouting] = useState(false);
  const [bookingRoutingEventCoordinatorsLargeEvents, setBookingRoutingEventCoordinatorsLargeEvents] = useState([]);
  const [bookingsByCoordinator, setBookingsByCoordinator] = useState([]);
  const [isDeleteCoordinatorError, setIsDeleteCoordinatorError] = useState(false);

  const [deleteOneCoordinator] = useMutation(mutationDeleteOneCoordinator);

  useQuery(QueryAllCoordinators, {
    variables: { filter: {} },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setAllCoordinators(data.eventCoordinators);
    }
  });

  const [updateBookingRouting] = useMutation(mutationUpdateBookingRouting);
  const [updateLargeEventCoordinator] = useMutation(mutationUpdateLargeEventCoordinator);

  const handleModal = () => setOpenModalCoordinator(!openModalCoordinator);
  const handleModalDelete = () => setOpenModalDelete(!openModalDelete);

  useEffect(() => {
    if (allCoordinators) {
      const coordinators = [...allCoordinators];
      const coordinatorsArray = [];
      const headers = [
        "Id",
        "Name",
        "Email",
        "Default?",
        "Large Events",
        "CrmId",
        "Phone",
        "Twilio Phone",
        "Calendly Link"
      ];

      coordinatorsArray.push(headers);

      coordinators.forEach((element) => {
        const row = [
          element._id,
          element.name,
          element.email,
          element.default?.toString(),
          element.largeEvents?.toString(),
          element.crmId,
          element.phone,
          element.twilioPhone,
          element.calendlyLink
        ];
        coordinatorsArray.push(row);
      });
      setCoordinatorsDataToExport(coordinatorsArray);
    }
  }, [allCoordinators]);

  const [getBookingRouting] = useLazyQuery(QueryBookingRouting, {
    onCompleted: (bookingRoutingResultData) => {
      setBookingRoutingEventCoordinators(
        bookingRoutingResultData.bookingRouting.eventCoordinators
      );
    }
  });

  const [getBookingRoutingLargeEvents] = useLazyQuery(QueryBookingRouting, {
    onCompleted: (bookingRoutingResultData) => {
      setBookingRoutingEventCoordinatorsLargeEvents(
        bookingRoutingResultData.bookingRouting.eventCoordinators
      );
    }
  });

  useEffect(() => {
    getBookingRouting({
      variables: {
        name: "everyOtherLead"
      }
    });
  }, [allCoordinators]);

  useEffect(() => {
    getBookingRoutingLargeEvents({
      variables: {
        name: "everyOtherLeadLargeEvents"
      }
    });
  }, [allCoordinators]);

  const [getBookingsByCoordinator] = useLazyQuery(queryAllBookingsByCoordinator, {
    variables: {
      filterBy: [{name: "eventCoordinatorId", type: "string", operator: "eq", value: currentCoordinator._id}],
      offset: 0,
      limit: 10
    },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setBookingsByCoordinator(data?.getBookingsWithCriteria || []);
    }
  });

  useEffect(() => {
    if (openModalDelete) {
      getBookingsByCoordinator();
    } else {
      setIsDeleteCoordinatorError(false);
      setIsMutarionError(false);
    }
  }, [openModalDelete, currentCoordinator]);

  const getDataCoordinatorsToExport = () => coordinatorsDataToExport;

  const updateBookingRoutingEventCoordinators = async (bookingChecked, coordinatorId) => {
    try {
      setProcessingRouting(true);
      const updatedBookingRoutingEventCoordinators = [...bookingRoutingEventCoordinators];
      if (bookingChecked) {
        updatedBookingRoutingEventCoordinators.push(coordinatorId);
        setBookingRoutingEventCoordinators(
          updatedBookingRoutingEventCoordinators
        );
      } else {
        updatedBookingRoutingEventCoordinators.splice(
          bookingRoutingEventCoordinators.indexOf(coordinatorId),
          1
        );
        setBookingRoutingEventCoordinators(
          updatedBookingRoutingEventCoordinators
        );
      }
      await updateBookingRouting({
        variables: {
          name: "everyOtherLead",
          eventCoordinators: updatedBookingRoutingEventCoordinators
        }
      });
      setProcessingRouting(false);
    } catch (ex) {
      setIsMutarionError(true);
      setProcessingRouting(false);
      console.log("Something went wrong. Please try again", ex);
    }
  };

  const updateBookingRoutingEventCoordinatorsLargeEvents =  async (bookingChecked, coordinatorId) => {
    try {
      setProcessingLargeEventRouting(true);
      const updatedBookingRoutingEventCoordinatorsLargeEvent = [...bookingRoutingEventCoordinatorsLargeEvents];
      if (bookingChecked) {
        updatedBookingRoutingEventCoordinatorsLargeEvent.push(coordinatorId);
        setBookingRoutingEventCoordinatorsLargeEvents(
          updatedBookingRoutingEventCoordinatorsLargeEvent
        );
      } else {
        updatedBookingRoutingEventCoordinatorsLargeEvent.splice(
          bookingRoutingEventCoordinatorsLargeEvents.indexOf(coordinatorId),
          1
        );
        setBookingRoutingEventCoordinatorsLargeEvents(
          updatedBookingRoutingEventCoordinatorsLargeEvent
        );
      }
      await updateBookingRouting({
        variables: {
          name: "everyOtherLeadLargeEvents",
          eventCoordinators: updatedBookingRoutingEventCoordinatorsLargeEvent
        }
      });
      setProcessingLargeEventRouting(false);
    } catch (ex) {
      setIsMutarionError(true);
      setProcessingLargeEventRouting(false);
      console.log("Something went wrong. Please try again", ex);
    }
  };

  const updateLargeEventsCoodinator = async (largeEvents, CoordinatorId) => {
    try {
      setProcessingLargeEventRouting(true);
      await updateLargeEventCoordinator({
        variables: {
          id: CoordinatorId,
          largeEvents
        }
      });
      setProcessingLargeEventRouting(false);
    } catch (ex) {
      setIsMutarionError(true);
      setProcessingLargeEventRouting(false);
      console.error("Something went wrong. Please try again", ex);
    }
  };

  const columns = getColumns(
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
  );

  const deleteCoordinator = async () => {
    setProccesing(true);
    try {
      const results = await deleteOneCoordinator({
        variables: {
          id: currentCoordinator._id
        }
      });
      if (results) {
        setAllCoordinators(allCoordinators.filter(({_id}) => _id !== currentCoordinator._id));
      }
      if (bookingRoutingEventCoordinators.includes(currentCoordinator._id)) {
        updateBookingRoutingEventCoordinators(false, currentCoordinator._id);
      }
      if (bookingRoutingEventCoordinatorsLargeEvents.includes(currentCoordinator._id)) {
        updateBookingRoutingEventCoordinatorsLargeEvents(false, currentCoordinator._id);
      }
      handleModalDelete();
    } catch (ex) {
      setIsMutarionError(true);
      console.log("Something went wrong. Please try again", ex);
    }
    setProccesing(false);
  };

  const handleDeleteCoordinator = () => {
    if (!bookingsByCoordinator.count) {
      deleteCoordinator();
      return;
    }
    setIsDeleteCoordinatorError(true);
  };

  useEffect(() => {
    const coordinatorsFiltered = [...allCoordinators] || [];
    setAllCoordinatorSearchFiltersApply(coordinatorsFiltered.filter((coordinator) => (
      coordinator?.name.toLowerCase().includes(searchCoordinators.toLowerCase()) || 
      coordinator?.email.toLowerCase().includes(searchCoordinators.toLowerCase())
    )));
  }, [searchCoordinators, allCoordinators]);

  return (
    <Container>
      <TasksBar
        setElementToAdd={function () {}}
        titleView={"Coordinators"}
        titleBadge={` ${allCoordinatorSearchFiltersApply.length} records found`}
        showAddModal={handleModal}
        getDataToExport={getDataCoordinatorsToExport}
        fileExportedName={"Coordinators"}
        buttonTitle={"Add coordinator"}
        isSearchFilter={true}
        searchValue={searchCoordinators}
        setSearchValue={setSearchCoordinators}
      />
      <DataTable
        columns={columns}
        data={allCoordinatorSearchFiltersApply}
        noHeader
        sortIcon={<ChevronDown size={10}/>}
        className="react-dataTable my-2"
      />
      {openModalCoordinator && (
        <CoordinatorsModal
          open={openModalCoordinator}
          isModeEdit={isModeEdit}
          handleModal={handleModal}
          setIsModeEdit={setIsModeEdit}
          data={isModeEdit ? currentCoordinator : null}
        />
      )}
      {openModalDelete && (
        <ModalDeleteConfirmation
          isOpenModalDelete={openModalDelete}
          toggleModalDelete={handleModalDelete}
          handleDeleteItem={handleDeleteCoordinator}
          isDeletingGetError={isDeleteCoordinatorError}
          isMutationError={isMutationError}
          proccesing={proccesing}
          itemName="Coordinator"
        />
      )}
    </Container>
  );
};

export default CoordinatorsList;
