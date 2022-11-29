// @packages
import React, { useEffect, useState } from "react";
import { Key, List, Truck, Video } from "react-feather";
import { Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, ModalBody } from "reactstrap";
import { useMutation } from "@apollo/client";
import Select from "react-select";
import validator from "validator";

// @scripts
import { selectThemeColors } from "@utils";
import sendEmailConferenceLinkChangedByCoordinatorMutation from "@graphql/email/sendEmailConferenceLinkChangedByCoordinator";
import MutationUpdateSettingsBooking from "@graphql/MutationUpdateSettingsBooking";

const SettingsComponent = ({ currentElement, editMode, closedBookingReason, cancel, onEditCompleted }) => {

  const [classOptionsTags, setClassOptionsTags] = useState([]);
  const [bookingTags, setBookingTags] = useState([]);
  const [individualTag, setIndividualTag] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isChangingJoinLink, setIsChangingJoinLink] = useState(false);
  const [joinLink, setJoinLink] = useState("");
  const [passwordLink, setPasswordLink] = useState("");
  const [trackingLink, setTrackingLink] = useState("");
  const [isValidUrl, setIsValidUrl] = useState({
    trackingLink: true,
    joinUrl: true
  });
  const [updateSettingsBooking] = useMutation(MutationUpdateSettingsBooking);
  const [sendEmailConferenceLinkChangedByCoordinator] = useMutation(sendEmailConferenceLinkChangedByCoordinatorMutation);

  useEffect(() => {
    if (currentElement) {
      setTrackingLink(currentElement?.shippingTrackingLink || "");
      setJoinLink(currentElement?.joinInfo?.joinUrl || "");
      setPasswordLink(currentElement.joinInfo && currentElement.joinInfo.password || "");
      setClassOptionsTags(currentElement?.additionalClassOptions || []);
    }
  }, [currentElement]);

  const selectStylesTags = {
    control: (base) => ({
      ...base,
      fontSize: 12
    }),
    option: (provided) => ({
      ...provided,
      borderBottom: "1px dotted",
      padding: 10,
      fontSize: 12
    }),
    singleValue: (provided) => ({
      ...provided,
      padding: 0,
      paddingTop: 7,
      fontSize: 12
    })
  };

  const urlValidation = ({ target }) => {
    const { name, value } = target;
    setIsValidUrl({ ...isValidUrl, [name]: !value ? true : validator.isURL(value) });
  };

  const handleAddition = (e) => {
    if (e.key === "Enter") {
      setIndividualTag("");
      const tag = {
        groupId: e.target.value,
        text: e.target.value
      };
      setClassOptionsTags([...classOptionsTags, tag]);
    }
  };

  const handleDelete = (i) => {
    setClassOptionsTags(classOptionsTags.filter((_, index) => index !== i));
  };

  const tagsList = [
    { value: "manual", label: "Manual" },
    { value: "spam", label: "Spam" },
    { value: "drift", label: "Drift" },
    { value: "referral", label: "Referral" },
    { value: "repeat", label: "Repeat" },
    { value: "demo event", label: "Demo Event" },
    { value: "newsletter", label: "Newsletter" },
    { value: "outbound email", label: "Outbound Email" }
  ];

  const handleUpdateBooking = async () => {
    setProcessing(true);
    let joinInfo = { ...currentElement.joinInfo };
    if (!joinLink && !passwordLink) {
      joinInfo = undefined;
    } else if (joinInfo && joinInfo.joinUrl) {
      joinInfo.joinUrl = joinLink;
      joinInfo.password = passwordLink;
    } else {
      joinInfo = {
        joinUrl: joinLink,
        password: passwordLink
      };
    }

    try {
      await updateSettingsBooking({
        variables: {
          bookingId: currentElement._id,
          date: new Date(),
          shippingTrackingLink: trackingLink,
          joinInfo,
          joinInfo_unset: joinInfo ? false : true,
          additionalClassOptions: classOptionsTags,
          tags: bookingTags
        }
      });

      if (isChangingJoinLink) {
        const resultConferenceEmail = await sendEmailConferenceLinkChangedByCoordinator({
          variables: {
            bookingId: currentElement._id
          }
        });
        console.log("Sending join info Email", resultConferenceEmail);
      }
      setProcessing(false);
      cancel();
      onEditCompleted(currentElement._id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ModalBody className="flex-grow-1">
      <FormGroup>
        <Label for="joinUrl">
          <strong>Id:</strong> <span className="text-primary">{`${currentElement?._id}`}</span>
        </Label>
      </FormGroup>
      <FormGroup>
        <Label for="joinUrl">Event join info</Label>
        <InputGroup size="sm">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <Video size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="text"
            id="joinUrl"
            name="joinUrl"
            placeholder="Event link"
            value={joinLink}
            onChange={(e) => {
              setJoinLink(e.target.value);
              if (currentElement?.joinInfo?.joinUrl?.trim().toLowerCase() !== e.target.value.trim().toLowerCase()) {
                setIsChangingJoinLink(true);
              } else {
                setIsChangingJoinLink(false);
              }
            }}
            onBlur={(e) => urlValidation(e)}
          />
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <InputGroup size="sm">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <Key size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="text"
            id="key"
            name="key"
            placeholder="Event password"
            value={passwordLink}
            onChange={(e) => {
              setPasswordLink(e.target.value);
              if (currentElement?.joinInfo?.password?.trim().toLowerCase() !== e.target.value.trim().toLowerCase()) {
                setIsChangingJoinLink(true);
              } else {
                setIsChangingJoinLink(false);
              }
            }}
          />
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label for="trackingLink">Shipping tracking</Label>
        <InputGroup size="sm">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <Truck size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="text"
            id="trackingLink"
            name="trackingLink"
            placeholder="Tracking doc link"
            value={trackingLink}
            onChange={(e) => setTrackingLink(e.target.value)}
            onBlur={(e) => urlValidation(e)}
          />
        </InputGroup>
      </FormGroup>

      <FormGroup>
        <Label for="classOptions">Additional class options</Label>
        <InputGroup size="sm">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <List size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="text"
            id="classOptions"
            name="classOptions"
            placeholder="New options"
            disabled={classOptionsTags.length >= 20 ? true : false}
            onChange={(e) => setIndividualTag(e.target.value)}
            value={individualTag}
            onKeyDown={handleAddition}
          />
        </InputGroup>
      </FormGroup>

      {classOptionsTags &&
        classOptionsTags.map((tag, index) => (
          <span key={`${tag}${index}`} className="tags">
            {tag.text}
            <a href="#" className="pl-1" onClick={() => handleDelete(index)}>
              x
            </a>
          </span>
        ))}

      <FormGroup>
        <a target="_blank" rel="noopener noreferrer" href={`https://teamclass.com/booking/pre-event/${currentElement?._id}`}>
          <small>Click to see survey"s answer, and selected options.</small>
        </a>
        {!currentElement?.preEventSurvey?.submittedAt && <p className="pre-event-small-note">(Pre event survey is yet to be completed.)</p>}
      </FormGroup>

      <FormGroup>
        <Label for="selectedtags">Tags</Label>
        <Select
          theme={selectThemeColors}
          className="react-select"
          classNamePrefix="select"
          placeholder="Booking tags"
          options={tagsList}
          isMulti
          closeMenuOnSelect={false}
          styles={selectStylesTags}
          defaultValue={tagsList.map((tag) => currentElement?.tags?.includes(tag.value) && tag)}
          onChange={(element) => setBookingTags(element.map((tag) => tag.value))}
        />
      </FormGroup>

      {editMode && (
        <div align="center">
          <Button
            className="mr-1"
            size="sm"
            color={closedBookingReason ? "danger" : "primary"}
            onClick={handleUpdateBooking}
            disabled={!isValidUrl.joinUrl || !isValidUrl.trackingLink}
          >
            {!processing && !closedBookingReason
              ? "Save"
              : closedBookingReason && processing
              ? "Saving..."
              : processing
              ? "Saving..."
              : "Close booking?"}
          </Button>
          <Button
            color="secondary"
            size="sm"
            onClick={cancel}
            outline
          >
            Cancel
          </Button>
        </div>
      )}
    </ModalBody>
  );
};

export default SettingsComponent;
