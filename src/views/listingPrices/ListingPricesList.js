/* eslint-disable no-unused-expressions */
// @packages
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown, Spinner } from 'reactstrap';
import { FileText, Share } from 'react-feather';
import { useQuery, useMutation } from '@apollo/client';
import StringFilter from '@inovua/reactdatagrid-community/StringFilter';

//@reactdatagrid packages
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import '@inovua/reactdatagrid-enterprise/index.css';
import '@inovua/reactdatagrid-enterprise/theme/default-light.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-dark.css';

// @scripts
import { isUserLoggedIn, getUserData } from '@utils';
import ExportToExcelLegacy from '../../components/ExportToExcelLegacy';
import mutationUpdateClassListingPrices from '../../graphql/MutationUpdateClassListingPrices';
import queryAllClassesForListingPrice from '../../graphql/QueryAllClassesForListingPrice';
import queryAllInstructors from '../../graphql/QueryAllInstructors';
import { getAllTeamClasses } from '../../services/BookingService';

import '../booking/BookingsTable.scss';

const gridStyle = { minHeight: 600 };

const ListingPricesList = () => {
  const skin = useSelector((state) => state.bookingsBackground);
  const [teamClass, setTeamClass] = useState(null);
  const [instructors, setInstructors] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [classVariantsExcelTable, setClassVariantsExcelTable] = useState([]);
  const [userData, setUserData] = useState(null);
  const [filterValue, setFilterValue] = useState([
    { name: 'title', operator: 'contains', type: 'string', value: '' },
    { name: 'variantTitle', operator: 'contains', type: 'string', value: '' }
  ]);

  const genericFilter = {};

  const [updateClassListingPrices] = useMutation(mutationUpdateClassListingPrices, {});

  const columns = [
    {
      name: 'tableId',
      header: 'Table Id',
      type: 'string',
      defaultVisible: false,
      editable: false,
      render: ({ value }) => {
        return <span className="">{value}</span>;
      }
    },
    {
      name: 'title',
      header: 'Listing \nClass',
      type: 'string',
      filterEditor: StringFilter,
      defaultWidth: 250,
      editable: false,
      render: ({ value }) => {
        return <span className="">{value}</span>;
      }
    },
    {
      name: 'variantTitle',
      header: 'Variant',
      defaultWidth: 180,
      type: 'string',
      filterEditor: StringFilter,
      editable: false,
      render: ({ cellProps }) => {
        return <span className="">{cellProps.data.variant.title}</span>;
      }
    },
    {
      name: 'variantGroupEvent',
      header: 'Person / Group',
      type: 'string',
      editable: false,
      render: ({ cellProps }) => {
        return <span className="">{cellProps.data.variant.groupEvent ? 'Group' : 'Person'}</span>;
      }
    },
    {
      name: 'priceTiers',
      header: 'Tiers',
      type: 'string',
      defaultWidth: 80,
      editable: false,
      render: ({ cellProps }) => {
        return (
          <span className="">{cellProps.data.priceTier ? `${cellProps.data.priceTier.minimum} - ${cellProps.data.priceTier.maximum}` : ''}</span>
        );
      }
    },
    {
      name: 'pricePerson',
      header: 'Web Price',
      type: 'number',
      defaultWidth: 118,
      render: ({ cellProps }) => {
        return (
          <span className="float-right">
            $ {cellProps.data.variant.groupEvent ? cellProps.data.priceTier.price : cellProps.data.variant.pricePerson}
          </span>
        );
      }
    },
    {
      name: 'pricePersonInstructor',
      header: 'Instructor Price',
      type: 'number',
      render: ({ cellProps }) => {
        return (
          <span className="float-right">
            {cellProps.data.variant.groupEvent && cellProps.data.priceTier.priceInstructor ? `$ ${cellProps.data.priceTier.priceInstructor}` : ''}
            {cellProps.data.variant.pricePersonInstructor ? `$ ${cellProps.data.variant.pricePersonInstructor}` : ''}
          </span>
        );
      }
    },
    {
      name: 'instructorFlatFee',
      header: 'Instructor Flat Fee',
      type: 'number',
      render: ({ cellProps }) => {
        return (
          <span className="float-right">{cellProps.data.variant.instructorFlatFee ? `$ ${cellProps.data.variant.instructorFlatFee}` : ''} </span>
        );
      }
    },
    {
      name: 'variantHasKit',
      header: 'Kit Included',
      type: 'string',
      editable: false,
      defaultWidth: 100,
      render: ({ cellProps }) => {
        return <span>{cellProps.data.variant.hasKit ? 'Yes' : 'No'}</span>;
      }
    },
    {
      name: 'variantActive',
      header: 'Variant status',
      type: 'string',
      defaultWidth: 130,
      editable: false,
      render: ({ cellProps }) => {
        return <span>{cellProps.data.variant.active ? 'Active' : 'Inactive'}</span>;
      }
    },
    {
      name: 'isActive',
      header: 'Published',
      type: 'string',
      editable: false,
      defaultWidth: 115,
      render: ({ value }) => {
        return <span>{value ? 'Yes' : 'No'}</span>;
      }
    },
    { name: 'instructorName', header: 'Instructor Name', type: 'string', editable: false },
    {
      name: 'instructorEmail',
      header: 'Instructor Email',
      type: 'string',
      editable: false,
      render: ({ cellProps }) => {
        const classInstructor = instructors.find((item) => item._id === cellProps.data.instructorId);
        return <span className="">{classInstructor && classInstructor.email}</span>;
      }
    }
  ];

  useEffect(async () => {
    const { data } = await getAllTeamClasses(filterValue);
    setTeamClass(data);
  }, [filterValue]);

  const { ...allInstructors } = useQuery(queryAllInstructors, {
    fetchPolicy: 'cache-and-network',
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
      teamClass.map((item) => {
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
                instructorFlatFee: item2.instructorFlatFee,
                variant: item2
              });
            } else {
              item2.priceTiers.map((item3, index2) => {
                newTeamClass.push({
                  variantIndex: index,
                  tierIndex: index2,
                  _id: item._id,
                  tableId: item._id + index + index2,
                  title: item.title,
                  isActive: item.isActive,
                  instructorName: item.instructorName,
                  instructorId: item.instructorId,
                  variantTitle: item2.title,
                  pricePerson: item3.price,
                  pricePersonInstructor: item3.priceInstructor,
                  instructorFlatFee: item2.instructorFlatFee,
                  variant: item2,
                  priceTier: item3
                });
              });
            }
          });
      });
      setDataSource(
        newTeamClass.filter(
          ({ variant }) => (
            variant.title.toLowerCase().includes(filterValue[1].value.toLowerCase()))
          )
      );
  }, [teamClass]);

  useEffect(() => {
    if (dataSource) {
      const classVariantsArray = [];
      const headers = [
        'id',
        'title',
        'variant',
        'group/person',
        'tiers',
        'web price',
        'isntructor price',
        'instructor flat fee',
        'has kit?',
        'variant active?',
        'class active?',
        'instructor name',
        'instructor email'
      ];

      classVariantsArray.push(headers);

      for (const i in dataSource) {
        const classInstructor = instructors.find((item) => item._id === dataSource[i].instructorId);
        const row = [
          dataSource[i]._id,
          dataSource[i].title,
          dataSource[i].variantTitle,
          dataSource[i].variant.groupEvent ? 'Group' : 'Person',
          dataSource[i].priceTier && `${dataSource[i].priceTier.minimum} - ${dataSource[i].priceTier.maximum}`,
          dataSource[i].variant.groupEvent ? `$${dataSource[i].priceTier.price}` : `$${dataSource[i].variant.pricePerson}`,
          dataSource[i].variant.groupEvent
            ? dataSource[i].priceTier.priceInstructor && `$${dataSource[i].priceTier.priceInstructor}`
            : dataSource[i].variant.pricePersonInstructor && `$${dataSource[i].variant.pricePersonInstructor}`,
          dataSource[i].variant.instructorFlatFee && `$${dataSource[i].variant.instructorFlatFee}`,
          dataSource[i].variant.hasKit ? 'Yes' : 'No',
          dataSource[i].variant.active ? 'Yes' : 'No',
          dataSource[i].isActive ? 'Yes' : 'No',
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
    const variantArray = teamClass.find((item) => item._id === newData._id).variants;
    variantArray[newData.variantIndex] = newData.variant;

    try {
      const resultUpdatePrices = await updateClassListingPrices({
        variables: {
          id: newData._id,
          variants: variantArray
        }
      });
    } catch (ex) {
      console.log('ex', ex);
    }
  };

  const onEditComplete = useCallback(({ value, columnId, rowId }) => {
    const data = [...dataSource];
    const filterData = data.find((item) => item.tableId === rowId);

    if (columnId === 'pricePerson') {
      if (filterData && filterData.variant.groupEvent) {
        filterData.priceTier.price = value;
      } else {
        filterData.variant.pricePerson = value;
      }
    }
    if (columnId === 'pricePersonInstructor') {
      if (filterData && filterData.variant.groupEvent) {
        filterData.priceTier.priceInstructor = value;
      } else {
        filterData.variant.pricePersonInstructor = value;
      }
    }
    if (columnId === 'instructorFlatFee') {
      filterData.variant.instructorFlatFee = value;
    }

    setDataSource(data);
    updatePrices(filterData);
  }, [dataSource]);

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <h4>All Classes</h4>
        <UncontrolledButtonDropdown>
          <DropdownToggle color="primary" caret outline title="Export">
            <Share size={13} />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem className="align-middle w-100">
              <ExportToExcelLegacy
                apiData={classVariantsExcelTable}
                fileName={'Listing Prices'}
                title={
                  <h6 className="p-0">
                    <FileText size={13} />
                    {'Excel file'}
                  </h6>
                }
              />
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
      {allInstructors.loading ? (
        <div>
          <div>
            <Spinner className="mr-25" />
            <Spinner type="grow" />
          </div>
        </div>
      ) : (
        <ReactDataGrid
          idProperty="tableId"
          style={gridStyle}
          columns={columns}
          // defaultFilterValue={filterValue}
          filterValue={filterValue}
          onEditComplete={onEditComplete}
          onFilterValueChange={setFilterValue}
          editable={userData?.customData?.role === 'Admin' ? true : false}
          dataSource={dataSource}
          licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
          theme={skin === 'dark' ? 'amber-dark' : 'default-light'}
        />
      )}
    </div>
  );
};

export default ListingPricesList;
