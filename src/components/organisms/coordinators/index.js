// @packages
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { Container } from "reactstrap";
import DataTable from "react-data-table-component";

// @scripts
import { getColumns } from "./columns";
import QueryAllCoordinators from "@graphql/QueryAllEventCoordinators";
import TasksBar from "@molecules/task-bar";
import CoordinatorsModal from "@molecules/coordinators-modal";

// @styles
import "@styles/react/libs/tables/react-dataTable-component.scss";

const CoordinatorsList = () => {
  const [openModalCoordinator, setOpenModalCoordinator] = useState(false);
  const [currentCoordinator, setCurrentCoordinator] = useState({});
  const [isModeEdit, setIsModeEdit] = useState(false);
  const [allCoordinators, setAllCoordinators] = useState([]);
  const [coordinatorsDataToExport, setCoordinatorsDataToExport] = useState([]);

  useQuery(QueryAllCoordinators, {
    variables: { filter: {} },
    onCompleted: (data) => {
      setAllCoordinators(data.eventCoordinators);
    }
  });

  const handleModal = () => setOpenModalCoordinator(!openModalCoordinator);

  useEffect(() => {
    if (allCoordinators) {
      const corrdonators = [...allCoordinators];
      const corrdonatorsArray = [];
      const headers = [
        "Id",
        "Name",
        "Email",
        "Default?",
        "CrmId",
        "Phone",
        "Twilio Phone",
        "Calendly Link"
      ];

      corrdonatorsArray.push(headers);

      corrdonators.forEach((element) => {
        const row = [
          element._id,
          element.name,
          element.email,
          element.default?.toString(),
          element.crmId,
          element.phone,
          element.twilioPhone,
          element.calendlyLink
        ];
        corrdonatorsArray.push(row);
      });
      setCoordinatorsDataToExport(corrdonatorsArray);
    }
  }, [allCoordinators]);

  const getDataCoordinatorsToExport = () => coordinatorsDataToExport;

  const columns = getColumns(
    handleModal,
    setIsModeEdit,
    setCurrentCoordinator
  );

  return (
    <Container>
      <TasksBar
        setElementToAdd={function () {}}
        titleView={"Coordinators"}
        titleBadge={` ${allCoordinators.length} records found`}
        showAddModal={handleModal}
        getDataToExport={getDataCoordinatorsToExport}
      />
      <DataTable
        columns={columns}
        data={allCoordinators}
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
          // data={isModeEdit ? currentInstructor : null}
        />
      )}
    </Container>
  );
};

export default CoordinatorsList;
