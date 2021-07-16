import {gql} from "@apollo/client"

export default gql`
query GetTeamClass($classId: String!) {
    teamClass(query: { _id : $classId }) {
      _id
      title
      category
      minimum
      hasKit
      shippingIncluded
      shippingCountries
      isVirtual
      duration
      pricePerson
      instructorId
      location
      instructorAvatarImage
      instructorName
      instructorIntro
      catalogImage
      description
      included
      isActive
      order
      timeZone
      timeZoneLabel
      crmId
      notes
      requiredFromAttendees
      kitIncludes
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
         duration
         pricePerson
         hasKit
         order
         active
      }
    }
  }`