// @packages
import { useEffect, useState } from "react";
import { Button, Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, ModalBody, Row } from "reactstrap";
import Select from "react-select";
import { useMutation } from "@apollo/client";
// @scripts
import SimpleEditor from "../simple-editor";
import { selectThemeColors } from "@utils";
import MutationUpdateSignUpPageSettings from "../../../graphql/MutationUpdateSignUpPageSettings";
// @styles
import "./styles.scss";

const SignUpSettingsComponent = ({ currentElement, editMode, closedBookingReason, close, onEditCompleted }) => {
  const [processing, setProcessing] = useState(false);
  const [inputFields, setInputFields] = useState([
    { id: 1, name:"label", label:"Label*", value: "", visible: false, type: "text", colSize:"12" },
    { id: 2, name:"placeholder", label:"Placeholder", value: "", visible: false, type: "text", colSize:"12"},
    { id: 3, name:"type", label:"Field Type*", value: "", visible: false, type: "select", colSize:"12"},
    { id: 5, name:"required", label:"Is required?*", value: "",  visible: false, type: "select", colSize:"5"},
    { id: 6, name:"active", label:"Is Active?*", value: "", visible: false, type: "select", colSize:"5"}
  ]);
  const [isSaveBtnVissible, setIsSaveBtnVissible] = useState(false);
  const [additionalCopyToShow, setAdditionalCopyToShow] = useState("");
  const [additionalRegistrationFields, setAdditionalRegistrationFields] = useState([]);
  const [addressIsOptional, setAddressIsOptional] = useState(false);
  const [invitationFrom, setInvitationFrom] = useState("");
  const [optionalAddressCopy, setOptionalAddressCopy] = useState("");
  const [additionalRegistrationFieldsToShow, setAdditionalRegistrationFieldsToShow] = useState([]);
  const [listItems, setListItems] = useState([]);

  const [updateSignUpSettings] = useMutation(MutationUpdateSignUpPageSettings, {});

  useEffect(() => {
    if (currentElement) {
      setAdditionalCopyToShow(currentElement?.signUpPageSettings?.additionalCopyToShow || "");
      setAdditionalRegistrationFields(currentElement?.signUpPageSettings?.additionalRegistrationFields || []);
      setAddressIsOptional(currentElement?.signUpPageSettings?.addressIsOptional || false);
      setInvitationFrom(currentElement?.signUpPageSettings?.invitationFrom || "");
      setOptionalAddressCopy(currentElement?.signUpPageSettings?.optionalAddressCopy || "");
      setAdditionalRegistrationFieldsToShow(currentElement?.signUpPageSettings?.additionalRegistrationFields || []);
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

  const showFields = () => {
    setIsSaveBtnVissible(true);
    const updatedFields = inputFields.map((field) => ({
      ...field,
      visible: true
    }));
    setInputFields(updatedFields);
  };

  const saveAndHideFields = () => {
    const newField = {
      label: inputFields.find((obj) => obj.name === "label").value,
      placeholder: inputFields.find((obj) => obj.name === "placeholder").value,
      type: inputFields.find((obj) => obj.name === "type").value,
      listItems: inputFields.find((obj) => obj.name === "type").value === "list" || inputFields.find((obj) => obj.name === "type").value === "multiSelectionList" ? 
        listItems : [],
      required: inputFields.find((obj) => obj.name === "required").value,
      active: inputFields.find((obj) => obj.name === "active").value,
      order: additionalRegistrationFields.length + 1
    };
  
    setAdditionalRegistrationFields([...additionalRegistrationFields, newField]);
    setAdditionalRegistrationFieldsToShow([...additionalRegistrationFields, newField]);
  
    const updatedFields = inputFields.map((field) => ({
      ...field,
      value: "",
      visible: false
    }));
    setInputFields(updatedFields);
    setIsSaveBtnVissible(false);
  };

  const handleUpdate = (data) => {
    setAdditionalCopyToShow(data);
  };


  const handleUpdateBooking = async () => {
    setProcessing(true);
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

  const isAddBtnDissabled = (fields) => {
    for (const field of fields) {
      if ((field.name === "name" || field.name === "type" || field.name === "required" || field.name === "active") && field.visible && field.value === "") {
        return false;
      }
    }
    return true;
  };

  return (
    <ModalBody className="flex-grow-1">
    <FormGroup>
      <Label for="joinUrl">
        <strong>Id:</strong> <span className="text-primary">{`${currentElement?._id}`}</span>
      </Label>
    </FormGroup>
    <FormGroup>
      <Label for="classOptions">Additional information to show:</Label>
      <SimpleEditor
        initialContent={additionalCopyToShow || ""}
        onChangeContent={(content) => {
          handleUpdate(content);
        }}
      />
    </FormGroup>
    <FormGroup>
      <Label for="classOptions">Additional registration fields</Label>
      {!isSaveBtnVissible && <Button className="ml-2 btn btn-primary btn-sm" onClick={showFields}>Add</Button>}
      <div className="additional-fields-container">
        {inputFields?.map((field) =>
          (field.visible ? (
            <div key={field.id}>
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
                <>
                  <Select
                    theme={selectThemeColors}
                    styles={selectStyles}
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
                      const updatedFields = inputFields.map((subField) => {
                        if (subField.id === field.id) {
                          if (field.name === "type") {
                            return { ...subField, value: option.value };
                          } else if (field.name === "required") {
                            return { ...subField, value: option.value === true };
                          } else if (field.name === "active") {
                            return { ...subField, value: option.value === true };
                          } else {
                            return subField;
                          }
                        }
                        return subField;
                      });
                      setInputFields(updatedFields);
                    }}
                    isClearable={false}
                  />
                  {field.name === "type" && (field.value === "list" || field.value === "multiSelectionList") && (
                    <div className="additional-fields-list-items" style={{ display: "block" }}>
                      <Label for="classOptions">List Items</Label>
                      <Input
                        type="text"
                        value={listItems}
                        onChange={(e) => {
                          const arrayOfStringValues = e.target.value.split(",");
                          setListItems(arrayOfStringValues);
                        }}
                      />
                      <small>Add the items separated by commas</small>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null)
        )}
      </div>
      {isSaveBtnVissible && <Button className="mt-1 btn btn-primary btn-sm" onClick={saveAndHideFields} disabled={!isAddBtnDissabled(inputFields)}>Add</Button>}
    </FormGroup>
    <Label className="mb-2" for="classOptions">
      <b><i>{additionalRegistrationFieldsToShow.map((item) => item.label).join(", ")}</i></b>
   </Label>
    <FormGroup>
      <Label for="classOptions">Is address optional?</Label>
      <Select
        theme={selectThemeColors}
        styles={selectStyles}
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
          value={invitationFrom}
          onChange={(e) => setInvitationFrom(e.target.value)}
        />
    </FormGroup>
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