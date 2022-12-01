// @packages
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Mail, Phone, User } from "react-feather";
import { FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from "reactstrap";

// @scripts
import QueryInstructorTeamMemberById from "@graphql/QueryInstructorTeamMemberById";
import QueryInstructorById from "@graphql/QueryInstructorById";

const TeamMemberInstructor = ({currentElement}) => {

  const [instructor, setInstructor] = useState("");
  const [instructorTeamMember, setInstructorTeamMember] = useState("");

  useQuery(QueryInstructorTeamMemberById, {
    fetchPolicy: "cache-and-network",
    variables: {
      instructorTeamMemberId: currentElement?.instructorTeamMemberId
    },
    onCompleted: (data) => {
      if (data?.instructorTeamMember) {
        setInstructorTeamMember(data.instructorTeamMember);
      }
    }
  });

  useQuery(QueryInstructorById, {
    fetchPolicy: "cache-and-network",
    variables: {
      instructorId: currentElement?.instructorId
    },
    onCompleted: (data) => {
      if (data?.instructor) {
        setInstructor(data?.instructor);
      }
    }
  });

  return (
    <>
      <FormGroup>
        <Label for="full-name">
          <strong>Id:</strong> <span className="text-primary">{`${currentElement?._id}`}</span>
        </Label>
      </FormGroup>
      <FormGroup>
        <Label className="">Instructor in charge of this class</Label>
      </FormGroup>
      <FormGroup>
        <InputGroup size="sm">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id="full-name" placeholder="Full Name *" value={instructorTeamMember?.name || instructor?.name || ""} disabled />
        </InputGroup>
        <InputGroup size="sm" className="mt-2">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <Mail size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input type="email" id="email" placeholder="Email *" value={instructorTeamMember?.email || instructor?.email || ""} disabled />
        </InputGroup>
        <InputGroup size="sm" className="mt-2">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <Phone size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input type="phone" id="phone" placeholder="Phone" value={instructorTeamMember?.phone || instructor?.phone || ""} disabled />
        </InputGroup>
      </FormGroup>
    </>
  );
};

export default TeamMemberInstructor;
