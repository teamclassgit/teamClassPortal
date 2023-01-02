/* eslint-disable no-unused-expressions */
// @packages
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown, Spinner } from "reactstrap";
import { FileText, Share } from "react-feather";
import { useQuery, useMutation } from "@apollo/client";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";

//@reactdatagrid packages
import ReactDataGrid from "@inovua/reactdatagrid-enterprise";

// @scripts
import { isUserLoggedIn, getUserData } from "@utils";
import ExportToExcelLegacy from "@molecules/export-to-excel-legacy";
import mutationUpdateClassListingPrices from "@graphql/MutationUpdateClassListingPrices";
import mutationUpdateClassListingTitle from "@graphql/MutationUpdateClassListingTitle";
import queryAllClassesForListingPrice from "@graphql/QueryAllClassesForListingPrice";
import queryAllInstructors from "@graphql/QueryAllInstructors";

// @styles
import "@inovua/reactdatagrid-enterprise/index.css";
import "@inovua/reactdatagrid-enterprise/theme/default-light.css";
import "@inovua/reactdatagrid-enterprise/theme/amber-dark.css";
import "@organisms/all-bookings/BookingsTable.scss";
import { getColums } from "./columns";

const gridStyle = { minHeight: 600 };

const ListingPricesList = () => {
  const skin = useSelector((state) => state.bookingsBackground);
  const [teamClass, setTeamClass] = useState(null);
  const [allDataClasses, setAllDataClasses] = useState([]);
  const [instructors, setInstructors] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [classVariantsExcelTable, setClassVariantsExcelTable] = useState([]);
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(true);
  const location = useLocation();
  const history = useHistory();
  const { filterByTitle = "", filterByTitleVariant = ""} = queryString.parse(location.search);
  const [filterValue, setFilterValue] = useState([
    { name: "title", operator: "contains", type: "string", value: filterByTitle },
    { name: "variantTitle", operator: "contains", type: "string", value: filterByTitleVariant }
  ]);

  const genericFilter = {};

  const [updateClassListingPrices] = useMutation(mutationUpdateClassListingPrices, {});
  const [updateClassListingTitle] = useMutation(mutationUpdateClassListingTitle, {});

  const { ...allData } = useQuery(queryAllClassesForListingPrice, {
    fetchPolicy: "cache-and-network",
    pollInterval: 200000,
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) {
        setAllDataClasses(data.teamClasses);
      }
    }
  });

  useEffect(() => {
    const allData = [...allDataClasses];
    history.replace({
      pathname: location.pathname,
      search: `?filterByTitle=${filterValue[0].value}&filterByTitleVariant=${filterValue[1].value}`
    });
    setTeamClass(allData?.filter(({ title }) => title.toLowerCase().includes(filterValue[0].value.toLowerCase())));
  }, [filterValue, allDataClasses]);

  useQuery(queryAllInstructors, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) {
        setInstructors(data.instructors);
      }
    }
  });

  useEffect(() => {
    const newTeamClass = [];
    teamClass &&
      teamClass.map((item, classIndex) => {
        item.variants &&
          item.variants.map((item2, index) => {
            if (!item2.groupEvent) {
              newTeamClass.push({
                variantIndex: index,
                _id: item._id,
                tableId: item._id + index,
                title: item.title,
                isActive: item.isActive,
                instructorName: item.instructorName,
                instructorId: item.instructorId,
                variantTitle: item2.title,
                pricePerson: item2.pricePerson,
                pricePersonInstructor: item2.pricePersonInstructor,
                expectedProfit: item.expectedProfit,
                instructorFlatFee: item2.instructorFlatFee,
                variant: item2
              });
            } else {
              item2.priceTiers.map((item3, index2) => {
                newTeamClass.push({
                  variantIndex: index,
                  tierIndex: index2,
                  _id: item._id,
                  id: classIndex,
                  tableId: item._id + index + index2,
                  title: item.title,
                  isActive: item.isActive,
                  instructorName: item.instructorName,
                  instructorId: item.instructorId,
                  variantTitle: item2.title,
                  pricePerson: item3.price,
                  pricePersonInstructor: item3.priceInstructor,
                  instructorFlatFee: item2.instructorFlatFee,
                  expectedProfit: item2.expectedProfit,
                  variant: item2,
                  priceTier: item3
                });
              });
            }
          });
      });
    setDataSource(newTeamClass.filter(({ variant }) => variant.title.toLowerCase().includes(filterValue[1].value.toLowerCase())));
  }, [teamClass]);

  useEffect(() => {
    if (dataSource) {
      const classVariantsArray = [];
      const headers = [
        "id",
        "title",
        "variant",
        "group/person",
        "tiers",
        "web price",
        "isntructor price",
        "instructor flat fee",
        "has kit?",
        "variant active?",
        "class active?",
        "instructor name",
        "instructor email"
      ];

      classVariantsArray.push(headers);

      for (const i in dataSource) {
        const classInstructor = instructors?.find((item) => item._id === dataSource[i].instructorId);
        const row = [
          dataSource[i]._id,
          dataSource[i].title,
          dataSource[i].variantTitle,
          dataSource[i].variant.groupEvent ? "Group" : "Person",
          dataSource[i].priceTier && `${dataSource[i].priceTier.minimum} - ${dataSource[i].priceTier.maximum}`,
          dataSource[i].variant.groupEvent ? `$${dataSource[i].priceTier.price}` : `$${dataSource[i].variant.pricePerson}`,
          dataSource[i].variant.groupEvent
            ? dataSource[i].priceTier.priceInstructor && `$${dataSource[i].priceTier.priceInstructor}`
            : dataSource[i].variant.pricePersonInstructor && `$${dataSource[i].variant.pricePersonInstructor}`,
          dataSource[i].variant.instructorFlatFee && `$${dataSource[i].variant.instructorFlatFee}`,
          dataSource[i].variant.hasKit ? "Yes" : "No",
          dataSource[i].variant.active ? "Yes" : "No",
          dataSource[i].isActive ? "Yes" : "No",
          classInstructor && classInstructor.email
        ];

        classVariantsArray.push(row);
      }
      setClassVariantsExcelTable(classVariantsArray);
    }
  }, [dataSource]);

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(getUserData());
    }
  }, []);

  const updatePrices = async (newData) => {
    const variantArray = [...teamClass.find((item) => item._id === newData._id).variants];
    variantArray[newData.variantIndex] = newData.variant;

    try {
      const resultUpdatePrices = await updateClassListingPrices({
        variables: {
          id: newData._id,
          variants: variantArray
        }
      });
    } catch (ex) {
      console.log("ex", ex);
    }
  };

  const updateTitle = async (newData) => {
    try {
      const resultUpdateTitle = await updateClassListingTitle({
        variables: {
          id: newData._id,
          title: newData.title
        },
        optimisticResponse: {
          updateTitle: {
            id: newData._id,
            __typename: "TeamClass",
            variants: newData.title
          }
        }
      });
    } catch (ex) {
      console.log("ex", ex);
    }
  };

  const onEditComplete = useCallback(({ value, columnId, rowId }) => {
      const data = [...dataSource];
      const filterData = { ...data.find((item) => item.tableId === rowId) };
      const newVariant = { ...filterData.variant };

      if (columnId === "pricePerson") {
        if (filterData && filterData.variant.groupEvent) {
          const newPriceTiers = [...filterData.variant.priceTiers];
          const newPriceTierItem = { ...newPriceTiers[filterData.tierIndex] };
          newPriceTierItem.price = value;
          newPriceTiers[filterData.tierIndex] = newPriceTierItem;
          filterData.variant = { ...newVariant, priceTiers: newPriceTiers };
        } else {
          filterData.variant.pricePerson = value;
        }
        updatePrices(filterData);
      }

      if (columnId === "pricePersonInstructor") {
        if (filterData && filterData.variant.groupEvent) {
          const newPriceTiers = [...filterData.variant.priceTiers];
          const newPriceTierItem = { ...newPriceTiers[filterData.tierIndex] };
          newPriceTierItem.priceInstructor = value;
          newPriceTiers[filterData.tierIndex] = newPriceTierItem;
          filterData.variant = { ...newVariant, priceTiers: newPriceTiers };
        } else {
          filterData.variant = { ...newVariant, pricePersonInstructor: value };
        }
        updatePrices(filterData);
      }

      if (columnId === "instructorFlatFee") {
        filterData.variant = { ...newVariant, instructorFlatFee: value };
        updatePrices(filterData);
      }

      if (columnId === "variantTitle") {
        filterData.variant = { ...newVariant, title: value };
        updatePrices(filterData);
      }

      if (columnId === "title") {
        filterData.title = value;
        updateTitle(filterData);
      }

      if (columnId === "expectedProfit") {
        filterData.variant = { ...newVariant, expectedProfit: value / 100 };
        updatePrices(filterData);
      }

      if (!!value) {
        setDataSource(data.map(variant => (variant.tableId !== rowId ? variant : filterData)));
      }
    },
    [dataSource]
  );

  const onEditableChange = useCallback((editable) => {
    setEditable(editable);
  }, []);

  const columns = getColums(editable, onEditableChange, instructors);

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <h4>All classes</h4>
        <UncontrolledButtonDropdown>
          <DropdownToggle color="primary" caret outline title="Export">
            <Share size={13} />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem className="align-middle w-100">
              <ExportToExcelLegacy
                apiData={classVariantsExcelTable}
                fileName={"Listing Prices"}
                title={
                  <h6 className="p-0">
                    <FileText size={13} />
                    {"Excel file"}
                  </h6>
                }
              />
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
      <ReactDataGrid
        idProperty="tableId"
        style={gridStyle}
        columns={columns}
        loading={allData.loading}
        filterValue={filterValue}
        onEditComplete={onEditComplete}
        onFilterValueChange={setFilterValue}
        editable={userData?.customData?.role === "Admin"}
        dataSource={dataSource || []}
        autoFocusOnEditComplete={false}
        licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
        theme={skin === "dark" ? "amber-dark" : "default-light"}
      />
    </div>
  );
};

export default ListingPricesList;
