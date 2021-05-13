import {gql} from "@apollo/client"

export default gql`
query GetTeamClass($classId:ID!) {
  getTeamClass(id: $classId) {
      id
      title
      category
      minimum
      hasKit
      isVirtual
      duration
      pricePerson
      instructorId
      location
      stars
      instructorAvatarImage
      instructorName
      instructorIntro
      catalogImage
      description
      included
      isActive
      requestQuotaEmailTemplate
      order
      timeZone
      timeZoneLabel
      crmId
      gallery {
        alt
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
        break
      }
  }
}`