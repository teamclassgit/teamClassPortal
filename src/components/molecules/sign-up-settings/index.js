import { useEffect, useState } from "react";
import { Button, Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, ModalBody, Row } from "reactstrap";
import SimpleEditor from "../simple-editor";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import MutationUpdateSignUpPageSettings from "../../../graphql/MutationUpdateSignUpPageSettings";
import { useMutation } from "@apollo/client";

const SignUpSettingsComponent = ({ currentElement, editMode, closedBookingReason, close, onEditCompleted }) => {
  const [processing, setProcessing] = useState(false);
  const [inputFields, setInputFields] = useState([
    { id: 1, name:"label", label:"Label*", value: "", visible: false, type: "text", colSize:"12" },
    { id: 2, name:"placeholder", label:"Placeholder", value: "", visible: false, type: "text", colSize:"12"},
    { id: 3, name:"type", label:"Field Type*", value: "", visible: false, type: "select", colSize:"12"},
    { id: 4, name:"list", label:"List Option?", value: "", visible: false, type: "text", colSize:"12"},
    { id: 5, name:"required", label:"Is required?", value: true,  visible: false, type: "select", colSize:"5"},
    { id: 6, name:"active", label:"Is Active?", value: true, visible: false, type: "select", colSize:"5"}
  ]);
  const [isSaveBtnVissible, setIsSaveBtnVissible] = useState(false);
  const [additionalCopyToShow, setAdditionalCopyToShow] = useState("");
  const [additionalRegistrationFields, setAdditionalRegistrationFields] = useState([]);
  const [addressIsOptional, setAddressIsOptional] = useState(false);
  const [invitationFrom, setInvitationFrom] = useState("");
  const [optionalAddressCopy, setOptionalAddressCopy] = useState("");
  const [additionalRegistrationFieldsToShow, setAdditionalRegistrationFieldsToShow] = useState([]);

  const [updateSignUpSettings] = useMutation(MutationUpdateSignUpPageSettings, {});

  useEffect(() => {
    if (currentElement) {
      setAdditionalCopyToShow(currentElement?.signUpPageSettings?.additionalCopyToShow || "");
      setAdditionalRegistrationFields(currentElement?.signUpPageSettings?.additionalRegistrationFields || []);
      setAddressIsOptional(currentElement?.signUpPageSettings?.addressIsOptional || false);
      setInvitationFrom(currentElement?.signUpPageSettings?.invitationFrom || "");
      setOptionalAddressCopy(currentElement?.signUpPageSettings?.optionalAddressCopy || "");
      setAdditionalRegistrationFieldsToShow(currentElement?.signUpPageSettings?.additionalRegistrationFields.map(item => item.label || []));
    }
  }, [currentElement]);

  const selectStyles = {
    control: (base) => ({
      ...base,
      height: 30,
      minHeight: 30,
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
      paddingBottom: 7,
      fontSize: 12
    })
  };

  // Function to show the input fields
  const showFields = () => {
    setIsSaveBtnVissible(true);
    const updatedFields = inputFields.map((field) => ({
      ...field,
      visible: true
    }));
    setInputFields(updatedFields);
  };

  // Function to save the input values and hide the fields
  const saveAndHideFields = () => {
    // Here, you can save the input field values or perform any other necessary action.
    console.log(inputFields);

    const updatedFields = inputFields.map((field) => ({
      ...field,
      value: "",
      visible: false
    }));
    setInputFields(updatedFields);
    setIsSaveBtnVissible(false);
    setAdditionalRegistrationFields(...additionalRegistrationFields, {
      active: inputFields.find(obj => obj.name === "active"),
      label: inputFields.find(obj => obj.name === "label"),
      listItems: inputFields.find(obj => obj.name === "list"),
      // name: inputFields.find(obj => obj.name === "label"),
      order: inputFields.length - 1,
      placeholder: inputFields.find(obj => obj.name === "placeholder"),
      required: inputFields.find(obj => obj.name === "required"),
      type: inputFields.find(obj => obj.name === "type")
    });
  };

  const handleUpdateBooking = async () => {
    setProcessing(true);
    // let signUpPageSettings = { ...currentElement.signUpPageSettings };
    // if (!joinLink && !passwordLink) {
    //   joinInfo = undefined;
    // } else if (joinInfo && joinInfo.joinUrl) {
    //   joinInfo.joinUrl = joinLink;
    //   joinInfo.password = passwordLink;
    // } else {
    //   joinInfo = {
    //     joinUrl: joinLink,
    //     password: passwordLink
    //   };
    // }

    try {
      const result = await updateSignUpSettings({
        variables: {
          id:currentElement?._id,
          updatedAt: new Date(),
          signUpPageSettings: {
            additionalCopyToShow,
            additionalRegistrationFields,
            addressIsOptional,
            invitationFrom,
            optionalAddressCopy
          }
        }
      });
      close();
      onEditCompleted(currentElement._id);
      setProcessing(false);
    } catch (e) {
      console.error(e);
    }
  };

  console.log("currentElement", currentElement);
  console.log("inputFields", inputFields);
  console.log("optionalAddressCopy", optionalAddressCopy);
  console.log("additionalRegistrationFields", additionalRegistrationFields);
  return (
    <ModalBody className="flex-grow-1">
    <FormGroup>
      <Label for="joinUrl">
        <strong>Id:</strong> <span className="text-primary">{`${currentElement?._id}`}</span>
      </Label>
    </FormGroup>
    <FormGroup>
      <Label for="classOptions">Additional information to show:</Label>
      {/* <SimpleEditor
        // initialContent={formInputs[input.name] || ""}
        // onChangeContent={(content) => {
        //   handleUpdate(content, input.name);
        // }}
      /> */}
    </FormGroup>
    <FormGroup>
      <Label for="classOptions">Additional registration fields</Label>
      {!isSaveBtnVissible && <Button className="ml-2 btn btn-primary btn-sm" onClick={showFields}>Add</Button>}
      <div>
        {inputFields?.map((field) =>
          (field.visible ? (
            <Row key={field.id}>
              <Col md={field.colSize}>
              <Label for="classOptions">{field.label}</Label>
              {field.type === "text" ? (
                  <Input
                    type="text"
                    value={field.value}
                    onChange={(e) => {
                      const updatedFields = inputFields.map((f) =>
                        (f.id === field.id ? { ...f, value: e.target.value } : f)
                      );
                      setInputFields(updatedFields);
                    }}
                  />
              ) : (
                  <Select
                    theme={selectThemeColors}
                    styles={selectStyles}
                    // isDisabled={currentElement.status === BOOKING_CLOSED_STATUS}
                    className="react-select edit-booking-select-instructor"
                    classNamePrefix="select"
                    placeholder="Select..."
                    value={{
                      // label: instructorName,
                      // value: instructorId
                    }}
                    options={field.name === "type" ? [
                      {
                        value: "list",
                        label: "list"
                      },
                      {
                        value: "text",
                        label: "text"
                      },
                      {
                        value: "textArea",
                        label: "textArea"
                      },
                      {
                        value: "number",
                        label: "number"
                      },
                      {
                        value: "multiSelectionList",
                        label: "multiSelectionList"
                      }
                    ] : 
                      [
                        {
                          value: true,
                          label: "Yes"
                        },
                        {
                          value: false,
                          label: "No"
                        }
                      ]
                    }
                    onChange={(option) => {
                      // setInstructorId(option.value);
                      // setInstructorName(option.label);
                    }}
                    isClearable={false}
                  />
              )}
              </Col>
            </Row>
          ) : null)
        )}
      {isSaveBtnVissible && <Button className="mt-1 btn btn-primary btn-sm" onClick={saveAndHideFields}>Add</Button>}
      </div>
    </FormGroup>
    {additionalRegistrationFieldsToShow?.map((item, idx) => (
      <Label key={idx} for="classOptions">{item.label.join(", ")}</Label>
    ))}
    <FormGroup>
      <Label for="classOptions">Is address optional?</Label>
      <Select
        theme={selectThemeColors}
        styles={selectStyles}
        // isDisabled={currentElement.status === BOOKING_CLOSED_STATUS}
        className="react-select edit-booking-select-instructor"
        classNamePrefix="select"
        placeholder="Select..."
        value={{
          label: addressIsOptional === true ? "Yes" : "No",
          value: addressIsOptional
        }}
        options={
          [
            {
              value: true,
              label: "Yes"
            },
            {
              value: false,
              label: "No"
            }
          ]
        }
        onChange={(option) => {
          setAddressIsOptional(option.value);
          // setInstructorName(option.label);
        }}
        isClearable={false}
      />
    </FormGroup>

    <FormGroup>
      <Label for="classOptions">Optional Address:</Label>
        <Input
          type="text"
          id="trackingLink"
          name="trackingLink"
          placeholder=""
          value={optionalAddressCopy}
          onChange={(e) => setOptionalAddressCopy(e.target.value)}
        />

    </FormGroup>
    <FormGroup>
      <Label for="classOptions">Invitation from?:</Label>
        <Input
          type="text"
          id="trackingLink"
          name="trackingLink"
          placeholder=""
          value={additionalCopyToShow}
          onChange={(e) => setAdditionalCopyToShow(e.target.value)}
        />
    </FormGroup>
    {/* <FormGroup>
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
    </FormGroup> */}

    {editMode && (
      <div align="center">
        <Button
          className="mr-1"
          size="sm"
          color={closedBookingReason ? "danger" : "primary"}
          onClick={handleUpdateBooking}
          // disabled={!isValidUrl.joinUrl || !isValidUrl.trackingLink}
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
          onClick={close}
          outline
        >
          Cancel
        </Button>
      </div>
    )}
  </ModalBody>
  );
};

export default SignUpSettingsComponent;