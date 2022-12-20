// @packages
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { Badge, Button, ButtonGroup, Col, Container, CustomInput, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner, UncontrolledButtonDropdown } from "reactstrap";
import { Icon } from "@iconify/react";
import Rating from "react-rating";

// @scripts
import Stars from "@atoms/stars";
import ExportToExcelLegacy from "@molecules/export-to-excel-legacy";
import ExportToExcel from "@molecules/export-to-excel";
import QueryAllReviews from "@graphql/QueryAllReviews";
import QueryAllClass from "@graphql/QueryAllClassForReviews";
import MutationUpdateReviewVisible from "@graphql/MutationUpdateReviewVisible";
import MutationUpdateReviewTestimonial from "@graphql/MutationUpdateReviewTestimonial";
import { Filter, Share } from "react-feather";

const ReviewsList = () => {
  const [filter, setFilter] = useState({ classId_ne: "", status: "done" });
  const [allReviews, setAllReviews] = useState([]);
  const [classes, setClasses] = useState([{ label: "All", value: "All" }]);
  const [updateReviewVisible] = useMutation(MutationUpdateReviewVisible);
  const [updateReviewTestimonial] = useMutation(MutationUpdateReviewTestimonial);
  const [getReviewsToExport, setGetReviewsToExport] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedClass, setSelectedClass] = useState({
    label: "All",
    value: "All"
  });

  useQuery(QueryAllReviews, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter
    },
    onCompleted: (data) => {
      if (data?.reviews) {
        setAllReviews(data.reviews);
      }
    }
  });

  useQuery(QueryAllClass, {
    variables: {
      filter: { category_ne: "" }
    },
    onCompleted: (data) => {
      if (data?.teamClasses) {
        setClasses(data.teamClasses);
      }
    }
  });

  useEffect(() => {
    if (allReviews) {
      const reviews = [...allReviews];
      const reviewsArray = [];
      const headers = [
        "Id",
        "Class Id",
        "Booking Id",
        "date",
        "Kit rating",
        "Class rating",
        "title",
        "Visible",
        "Testimonial",
        "nps",
        "Review text",
        "Company",
        "Attendee Id",
        "Attendee email",
        "Status"
      ];

      reviewsArray.push(headers);

      reviews.forEach((element) => {
        const row = [
          element._id,
          element.classId,
          element.BookingId,
          element.date,
          element.kitRating,
          element.classRating,
          element.title,
          element.visible?.toString(),
          element.testimonial?.toString(),
          element.nps,
          element.reviewText,
          element.company,
          element.attendeeId,
          element.attendeeEmail,
          element.status
        ];
        reviewsArray.push(row);
      });
      setGetReviewsToExport(reviewsArray);
    }
  }, [allReviews]);
  
  const getDataToExport = () => getReviewsToExport;

  const getClassName = (classId) => {
    const result = classes.filter((element) => element.value === classId);
    return result && result.length > 0 ? result[0].label : "";
  };

  useEffect(() => {
    if (selectedClass.value === "All") {
      setFilter({ classId_ne: "", status: "done" });
    } else {
      setFilter({ classId: selectedClass.value, status: "done" });
    }
  }, [selectedClass]);

  const flipReviewVisibility = async (reviewId, visible) => updateReviewVisible({
    variables: {
      id: reviewId,
      visible
    },
    optimisticResponse: {
      updateReviewVisible: {
        id: reviewId,
        visible,
        __typename:"Review"
      }
    }
  });

  const flipReviewTestimonial = async (reviewId, testimonial) => updateReviewTestimonial({
    variables: {
      id: reviewId,
      testimonial
    },
    optimisticResponse: {
      updateReviewTestimonial: {
        id: reviewId,
        testimonial,
        __typename:"Review"
      }
    }
  });

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="hero-heading mb-0">Reviews</h1>
          <Button color="link" className="text-muted" href="#" disabled>
            Attendees feedback
          </Button>
        </div>
        <div className="d-flex justify-content-between align-items-center flex-column flex-lg-row mb-5">
          <div className="mr-3">
            {allReviews && (
              <p className="mb-3 mb-lg-0">
                You have{" "}
                <strong>
                  {allReviews.length} review(s)
                </strong>
              </p>
            )}
          </div>
          <ButtonGroup>
            <UncontrolledButtonDropdown>  
                <DropdownToggle color="primary" caret outline title="Export">
                  <Share size={13} />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem className="align-middle w-100">
                    <ExportToExcel
                      apiDataFunc={async () => {
                        return await getDataToExport();
                      }}
                      fileName={"Reviews"}
                      setIsExporting={setIsExporting}
                    />
                  </DropdownItem>
                </DropdownMenu>
                {isExporting && (
                  <DropdownToggle color="primary" caret outline title="Exporting..." disabled={true}>
                    <Spinner size="sm" />
                  </DropdownToggle>
                )}
            </UncontrolledButtonDropdown>
            <Button
              outline
              color="primary"
              // onClick={() => setShowFiltersModal(true)}
              title="Filters"
            >
              <Filter size={13} />
            </Button>
          </ButtonGroup>
        </div>
        {allReviews.loading ? (
          <span>Loading...</span>
        ) : (
          <div className="list-group">
            {allReviews && allReviews.map((review) => (
              <Row key={review._id} className="list-group-item list-group-item-action d-flex py-3">
                <Col lg={3}>
                  <div className="d-flex align-items-center mb-1">
                    <h5>
                      {review.title}
                      <span className="text-muted">
                        {review?.company && (
                          <>
                            <span className="mx-1">-</span>
                            <small>
                              <span>{review.company}</span>
                            </small>
                          </>
                        )}
                      </span>
                      <br />
                      <a href={`mailto:${review.attendeeEmail}`}>
                        <small>
                          {review.attendeeEmail}
                        </small>
                      </a>
                    </h5>
                  </div>
                  <h6>
                    <Badge pill color="primary" className="mr-1">
                      Class rating
                    </Badge>
                    <Stars stars={review.classRating} />
                  </h6>
                  <h6>
                    <Badge pill color="secondary" className="mr-1">
                      Kit rating
                    </Badge>
                    <Stars stars={review.kitRating} />
                  </h6>
                  {review.nps && (
                    <Rating
                      stop={10}
                      className="mt-1"
                      initialRating={review.nps}
                      readonly={true}
                      emptySymbol={<Icon icon="material-symbols:circle" className="text-gray" width="20"/>}
                      fullSymbol={<Icon icon="material-symbols:circle" className="text-primary" width="20"/>}
                      placeholderSymbol={<Icon icon="material-symbols:circle" className="text-primary" width="20"/>}
                    />
                  )}
                </Col>
                <Col>
                  <Row>
                    <Col md="9">
                      <a
                        className="text-primary text-wrap"
                        href={`${process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL}/classes/${review.classId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {getClassName(review.classId)}
                      </a>
                      <span className="text-muted">
                        ({moment(review.date).format("LL")})
                      </span>
                      <p className="mt-2">{review.reviewText}</p>
                    </Col>
                    <Col md="3" className="pt-3">
                      <CustomInput
                        id={review._id}
                        type="switch"
                        checked={review.visible}
                        label="Published"
                        onChange={(e) => {
                          e.preventDefault();
                          flipReviewVisibility(
                            review._id,
                            !review.visible
                          );
                        }}
                      />
                      <CustomInput
                        id={`${review._id}testimonial`}
                        type="switch"
                        className="mt-1"
                        checked={review.testimonial}
                        label="Testimonial"
                        onChange={(e) => {
                          e.preventDefault();
                          flipReviewTestimonial(
                            review._id,
                            !review.testimonial
                          );
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              ))}
          </div>
        )}
    </Container>
  );
};

export default ReviewsList;
