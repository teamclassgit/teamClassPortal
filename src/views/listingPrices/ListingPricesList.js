import React, { useState, useEffect, useContext } from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import '@inovua/reactdatagrid-enterprise/index.css';
import { useQuery } from '@apollo/client';

import queryAllClassesForListingPrice from '../../graphql/QueryAllClassesForListingPrice';

const gridStyle = { minHeight: 600 };

const ListingPricesList = () => {
  const [teamClass, setTeamClass] = useState(null);
  const genericFilter = {};

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

  const newTeamClass = [];
  // eslint-disable-next-line no-unused-expressions
  teamClass &&
    teamClass.map((item) => {
      // eslint-disable-next-line no-unused-expressions
      item.variants &&
        item.variants.map((item2) => {
          if (!item2.groupEvent) {
            newTeamClass.push({
              title: item.title,
              isActive: item.isActive,
              instructorName: item.instructorName,
              variant: item2
            });
          } else {
            item2.priceTiers.map((item3) => {
              newTeamClass.push({
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
  console.log('newTeamClass', newTeamClass);
  // setTeamClass(newTeamClass);

  console.log('teamClass', teamClass);

  const filterValue = [
    { name: 'title', operator: 'contains', type: 'string', value: '' },
    { name: 'variantTitle', operator: 'contains', type: 'string', value: '' },
    { name: 'variantGroupEvent', operator: 'contains', type: 'string', value: '' }
  ];

  const columns = [
    {
      name: 'title',
      header: 'Listing Class',
      type: 'string',
      render: ({ value, cellProps }) => {
        return <span className="">{value}</span>;
      }
    },
    {
      name: 'variantTitle',
      header: 'Variant',
      type: 'string',
      render: ({ value, cellProps }) => {
        return <span className="">{cellProps.data.variant.title}</span>;
      }
    },
    {
      name: 'variantGroupEvent',
      header: 'Person / Group',
      type: 'string',
      render: ({ value, cellProps }) => {
        return <span className="">{cellProps.data.variant.groupEvent ? 'Group' : 'Person'}</span>;
      }
    },
    {
      name: 'priceTiers',
      header: 'Tiers',
      type: 'string',
      render: ({ value, cellProps }) => {
        return (
          <span className="">{cellProps.data.priceTier ? `${cellProps.data.priceTier.minimum} - ${cellProps.data.priceTier.maximum}` : ''}</span>
        );
      }
    },
    {
      name: 'variantPricePerson',
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
      name: 'variantPricePersonInstructor',
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

  return (
    teamClass &&
    teamClass.length > 0 && (
      <div>
        <h3>All Classes</h3>
        <ReactDataGrid
          idProperty="_id"
          style={gridStyle}
          columns={columns}
          dataSource={newTeamClass}
          defaultFilterValue={filterValue}
          licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
        />
      </div>
    )
  );
};

export default ListingPricesList;
