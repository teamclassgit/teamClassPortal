// @packages
import React, { useState, useEffect, useContext } from "react";
import { Col, Spinner } from "reactstrap";
import { useQuery } from "@apollo/client";

// @scripts
import BookingsHeader from "../booking/BookingsHeader/BookingsHeader";
import queryAllGiftBasketPurchases from "../../graphql/QueryAllGiftBasketPurchases";
import queryAllGiftBaskets from "../../graphql/QueryAllGiftBaskets";
import queryAllCustomers from "../../graphql/QueryAllCustomers";
import { FiltersContext } from "../../context/FiltersContext/FiltersContext";
import TableGiftBaskets from "./TableGiftBaskets";

const GiftBasketsList = () => {
  const [giftBasketPurchases, setGiftBasketPurchases] = useState(null);
  const [giftBaskets, setGiftBaskets] = useState(null);
  const genericFilter = {};
  const [limit, setLimit] = useState(200);
  const [customers, setCustomers] = useState([]);
  const [filtereGiftPurchasedBaskets, setFilteredGiftPurchasedBaskets] = useState(null);
  const { textFilterContext } = useContext(FiltersContext);

  const { ...allGiftBasketsPurchase } = useQuery(queryAllGiftBasketPurchases, {
    fetchPolicy: "no-cache",
    pollInterval: 200000,
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) {
        setGiftBasketPurchases(data.giftBasketPurchases);
      }
    }
  });

  const { ...allGiftBaskets } = useQuery(queryAllGiftBaskets, {
    fetchPolicy: "no-cache",
    pollInterval: 200000,
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) {
        setGiftBaskets(data.giftBaskets);
      }
    }
  });

  const { ...allCustomersResult } = useQuery(queryAllCustomers, {
    fetchPolicy: "no-cache",
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) setCustomers(data.customers);
    },
    pollInterval: 200000
  });

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || "");
  }, [giftBasketPurchases]);

  const handleSearch = (value) => {
    if (value.length) {
      const updatedData =
        giftBasketPurchases &&
        giftBasketPurchases.filter((item) => {
          const startsWith = item.customerName && item.customerName.toLowerCase().startsWith(value.toLowerCase());
          const includes = item.customerName && item.customerName.toLowerCase().includes(value.toLowerCase());
          return startsWith || includes;
        });

      setFilteredGiftPurchasedBaskets(updatedData);
    } else {
      setFilteredGiftPurchasedBaskets(giftBasketPurchases);
    }
  };

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || "");
  }, [textFilterContext]);

  return (
    <>
      <BookingsHeader
        noCoordinators
        defaultLimit={200}
        coordinators={""}
        showLimit={true}
        onChangeLimit={(newLimit) => {
          setLimit(newLimit);
        }}
        defaultLimit={limit}
        showExport={true}
        showAdd={false}
        showFilter={false}
        showView={false}
        showAddModal={false}
        generalInquiries={""}
        isGeneralInquiries={false}
        isInProgressBookings={false}
        isDiscountCodes={false}
        isPrivateRequests={false}
        giftBasketPurchases={giftBasketPurchases}
        customers={customers}
        giftBaskets={giftBaskets}
        titleView={"Gift Baskets Purchases "}
        isClosedBookings={false}
        isGiftBasketsPurchase={true}
      />
      {allGiftBasketsPurchase.loading || allGiftBaskets.loading || allCustomersResult.loading ? (
        <div>
          <Spinner className="mr-25" />
          <Spinner type="grow" />
        </div>
      ) : (
        <>
          {giftBasketPurchases && giftBasketPurchases.length > 0 && (
            <Col sm="12">
              <TableGiftBaskets giftBasketPurchases={filtereGiftPurchasedBaskets} giftBaskets={giftBaskets} customers={customers} />
            </Col>
          )}
        </>
      )}
    </>
  );
};

export default GiftBasketsList;
