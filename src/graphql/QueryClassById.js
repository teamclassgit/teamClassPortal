import { gql } from "@apollo/client";

export default gql`
  query GetTeamClass($classId: String!) {
    teamClass(query: { _id: $classId }) {
      _id
      title
      category
      minimum
      hasKit
      instantBooking
      multipleInstructors
      shippingIncluded
      shippingCountries
      isVirtual
      internationalShipping
      duration
      pricePerson
      instructorId
      location
      listingFriendlyId
      instructorAvatarImage
      instructorName
      instructorIntro
      catalogImage
      description
      highlights
      isActive
      order
      timeZone
      timeZoneLabel
      crmId
      notes
      requiredFromAttendees
      kitIncludes
      additionalCategories
      firstTimeCustomerRequestQuoteCampaignId
      requestQuoteTemplateId
      addons {
        icon
        color
        name
        description
        multipleUnits
        unitPrice
        unit
        order
        active
        registrationFields {
          label
          placeholder
          type
          listItems
          required
          active
          order
        }
      }
      gallery {
        img
        title
      }
      tags {
        icon
        value
      }
      availability {
        fromHour
        fromMinutes
        toHour
        toMinutes
        dayOfWeek
        increment
      }
      variants {
        title
        notes
        minimum
        maximum
        duration
        pricePerson
        pricePersonInstructor
        expectedProfit
        hasKit
        order
        active
        groupEvent
        kitHasAlcohol
        instructorFlatFee
        priceTiers {
          maximum
          minimum
          price
          priceInstructor
        }
        registrationFields {
          label
          placeholder
          type
          listItems
          required
          active
          order
        }
      }
      registrationFields {
        label
        placeholder
        type
        listItems
        required
        active
        order
      }
    }
  }
`;
