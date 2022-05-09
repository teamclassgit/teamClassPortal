/* eslint-disable no-unused-expressions */
// @packages
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';

//@reactdatagrid packages
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import '@inovua/reactdatagrid-enterprise/index.css';

// @scripts
import mutationUpdateClassListingPrices from '../../graphql/MutationUpdateClassListingPrices';
import queryAllClassesForListingPrice from '../../graphql/QueryAllClassesForListingPrice';

const gridStyle = { minHeight: 600 };

const ListingPricesList = () => {
  const [teamClass, setTeamClass] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [variantIndex, setVariantIndex] = useState(null);

  const genericFilter = {};

  const [updateClassListingPrices] = useMutation(mutationUpdateClassListingPrices, {});

  const filterValue = [
    { name: 'title', operator: 'contains', type: 'string', value: '' },
    { name: 'variantTitle', operator: 'contains', type: 'string', value: '' },
    { name: 'variantGroupEvent', operator: 'contains', type: 'string', value: '' }
  ];

  const columns = [
    {
      name: 'tableId',
      header: 'Table Id',
      type: 'string',
      defaultVisible: false,
      editable: false,
      render: ({ value, cellProps }) => {
        return <span className="">{value}</span>;
      }
    },
    {
      name: 'title',
      header: 'Listing Class',
      type: 'string',
      // editable: false,
      render: ({ value, cellProps }) => {
        return <span className="">{value}</span>;
      }
    },
    {
      name: 'variantTitle',
      header: 'Variant',
      type: 'string',
      editable: false,
      render: ({ value, cellProps }) => {
        return <span className="">{cellProps.data.variant.title}</span>;
      }
    },
    {
      name: 'variantGroupEvent',
      header: 'Person / Group',
      type: 'string',
      editable: false,

      render: ({ value, cellProps }) => {
        return <span className="">{cellProps.data.variant.groupEvent ? 'Group' : 'Person'}</span>;
      }
    },
    {
      name: 'priceTiers',
      header: 'Tiers',
      type: 'string',
      editable: false,
      render: ({ value, cellProps }) => {
        return (
          <span className="">{cellProps.data.priceTier ? `${cellProps.data.priceTier.minimum} - ${cellProps.data.priceTier.maximum}` : ''}</span>
        );
      }
    },
    {
      name: 'instructorPrice',
      header: 'Web Price',
      type: 'number',
      render: ({ value, cellProps }) => {
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
      render: ({ value, cellProps }) => {
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
      render: ({ value, cellProps }) => {
        return (
          <span className="float-right">{cellProps.data.variant.instructorFlatFee ? `$ ${cellProps.data.variant.instructorFlatFee}` : ''} </span>
        );
      }
    },
    {
      name: 'variantHasKit',
      header: 'Kit Included',
      type: 'string',
      render: ({ value, cellProps }) => {
        return <span className="float-right">{cellProps.data.variant.hasKit ? 'Yes' : 'No'}</span>;
      }
    },
    {
      name: 'variantActive',
      header: 'Variant status',
      type: 'string',
      render: ({ value, cellProps }) => {
        return <span className="float-right">{cellProps.data.variant.active ? 'Active' : 'Inactive'}</span>;
      }
    },
    {
      name: 'isActive',
      header: 'Published',
      type: 'string',
      render: ({ value, cellProps }) => {
        return <span className="float-right">{value ? 'Yes' : 'No'}</span>;
      }
    },
    { name: 'instructorName', header: 'Instructor Name', type: 'string' },
    { name: 'instructorEmail', header: 'Instructor Email', type: 'string' }
  ];

  const { ...allTeamClasses } = useQuery(queryAllClassesForListingPrice, {
    fetchPolicy: 'no-cache',
    pollInterval: 200000,
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) {
        setTeamClass(data.teamClasses);
      }
    }
  });

  console.log('columns', columns);

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
                  variant: item2,
                  priceTier: item3
                });
              });
            }
          });
      });
    setDataSource(newTeamClass);
    // console.log(
    //   'newTeamClass[tableId]',
    //   newTeamClass.filter((item) => item.tableId === '076723c7-f3d9-4142-b088-a6e49807c1b10')
    // );
  }, [teamClass]);

  // console.log('newTeamClass', newTeamClass);
  // setTeamClass(newTeamClass);
  console.log('dataSource', dataSource);

  const updatePrices = async (newData, isGroupEvent) => {
    console.log('newData', newData);
    const newVariantArray = dataSource.filter((item) => item._id === newData._id);
    console.log('newVariant', newVariantArray);
    try {
      const resultUpdatePrices = await updateClassListingPrices({
        variables: {
          id: newVariantArray[0]._id,
          variants: isGroupEvent ? newData.variant : newVariantArray.map((item) => item.variant)
        }
      });
    } catch (ex) {
      console.log('ex', ex);
    }
  };

  const onEditComplete = useCallback(
    ({ value, columnId, rowId }) => {
      console.log('value', value);
      console.log('columnId', columnId);
      console.log('rowId', rowId);
      const data = [...dataSource];
      const filterData = data.filter((item) => item.tableId === rowId);
      console.log('filterData', filterData);

      if (columnId === 'instructorPrice') {
        if (filterData && filterData[0].variant.groupEvent) {
          filterData[0].priceTier.price = value;
        } else {
          console.log('filterData', filterData);
          filterData[0].variant.pricePerson = value;
        }
      }
      if (columnId === 'pricePersonInstructor') {
        if (filterData && filterData[0].variant.groupEvent) {
          filterData[0].priceTier.priceInstructor = value;
        } else {
          console.log('filterData', filterData);
          filterData[0].variant.pricePersonInstructor = value;
        }
      }

      if (columnId === 'instructorFlatFee') {
        filterData[0].variant.instructorFlatFee = value;
      }

      setDataSource(data);
      setVariantIndex(filterData[0].variantIndex);
      updatePrices(filterData[0], filterData[0].variant.groupEvent);
    },
    [dataSource]
  );

  console.log('teamClass', teamClass);
  console.log('variantIndex', variantIndex);

  return (
    teamClass &&
    teamClass.length > 0 && (
      <div>
        <h3>All Classes</h3>
        <ReactDataGrid
          idProperty="tableId"
          style={gridStyle}
          columns={columns}
          onEditComplete={onEditComplete}
          editable={true}
          dataSource={dataSource}
          defaultFilterValue={filterValue}
          licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
        />
      </div>
    )
  );
};

export default ListingPricesList;
