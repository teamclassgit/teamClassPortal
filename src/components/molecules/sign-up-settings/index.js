// @packages
import { useEffect, useState } from "react";
import { Button, Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, ModalBody, Row } from "reactstrap";
import Select from "react-select";
import { useMutation } from "@apollo/client";
import { Edit, Trash2 } from "react-feather";
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
  const [isEditingAdditionalRegistrationFields, setIsEditingAdditionalRegistrationFields] = useState(false);
  const [editedField, setEditedField] = useState(null);

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
    const label = inputFields.find((obj) => obj.name === "label").value;
    const placeholder = inputFields.find((obj) => obj.name === "placeholder").value;
    const type = inputFields.find((obj) => obj.name === "type").value;
    const required = inputFields.find((obj) => obj.name === "required").value;
    const active = inputFields.find((obj) => obj.name === "active").value;
  
    const order = editedField ? editedField.order : additionalRegistrationFields.length + 1;
  
    const updatedField = {
      label,
      placeholder,
      type,
      listItems: (type === "list" || type === "multiSelectionList") ? listItems : [],
      required,
      active,
      order
    };
  
    if (editedField) {
      const updatedFields = additionalRegistrationFields.map((field) =>
        (isEqual(field, editedField) ? updatedField : field)
      );
      setAdditionalRegistrationFields(updatedFields);
      setAdditionalRegistrationFieldsToShow(updatedFields);
    } else {
      setAdditionalRegistrationFields([...additionalRegistrationFields, updatedField]);
      setAdditionalRegistrationFieldsToShow([...additionalRegistrationFields, updatedField]);
    }
  
    const clearedFields = inputFields.map((field) => ({
      ...field,
      value: "",
      visible: false
    }));
    setInputFields(clearedFields);
    setIsSaveBtnVissible(false);
    setEditedField(null);
    setListItems([]);
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
    setIsEditingAdditionalRegistrationFields(false);
    setEditedField({});
  };

  const isAddBtnDissabled = (fields) => {
    for (const field of fields) {
      if ((field.name === "name" || field.name === "type" || field.name === "required" || field.name === "active") && field.visible && field.value === "") {
        return false;
      }
    }
    return true;
  };

  // Util function to compare two objects
  const isEqual = (objA, objB) => {
    console.log("isEqual", JSON.stringify(objA) === JSON.stringify(objB));
    return JSON.stringify(objA) === JSON.stringify(objB);
  };

  const editAdditionalFields = (field) => {
    setEditedField(field);
    setIsEditingAdditionalRegistrationFields(true);
    setIsSaveBtnVissible(true);
    if (field.type === "list" || field.type === "multiSelectionList") {
      setListItems(field.listItems.join(", "));
    }
    const updatedFields = inputFields.map((inputField) => ({
      ...inputField,
      visible: true,
      value: field[inputField.name]
    }));
    setInputFields(updatedFields);
  };

  const deleteAdditionalFields = (field) => {
    let newAdditionalRegistrationFields = [...additionalRegistrationFields];
    newAdditionalRegistrationFields = newAdditionalRegistrationFields.filter(item => !isEqual(item, field));
    setAdditionalRegistrationFields(newAdditionalRegistrationFields);
    setAdditionalRegistrationFieldsToShow(newAdditionalRegistrationFields);
    const updatedFields = inputFields.map((field) => ({
      ...field,
      visible: false
    }));
    setInputFields(updatedFields);
    setEditedField();
    setIsEditingAdditionalRegistrationFields(false);
    setIsSaveBtnVissible(false);
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
                    value={field.name === "type" ? 
                    {
                      value: field.value,
                      label: field.value
                    } : 
                    {
                      value: field.value,
                      label: field.value === false ? "No" : field.value === true ? "Yes"  : ""
                    }
                  }
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
      {isSaveBtnVissible && (
        <>
          <Button className="mt-1 btn btn-primary btn-sm" onClick={saveAndHideFields} disabled={!isAddBtnDissabled(inputFields)}>{isEditingAdditionalRegistrationFields ? "Add Changes" : "Add"}</Button>
          <Button  color="secondary" className="mt-1 ml-1 btn-sm" outline onClick={_ => {
             const updatedFields = inputFields.map((field) => ({
              ...field,
              visible: false
            }));
            setInputFields(updatedFields);
            setEditedField();
            setIsEditingAdditionalRegistrationFields(false);
            setIsSaveBtnVissible(false);
          }}>
            {"Cancel"}
          </Button> 
 
        </>
      )}
    </FormGroup>
    <Label className="mb-2" for="classOptions">
      <b><i>{additionalRegistrationFieldsToShow.map((item, index) => <p key={index}>{item.label}{" "}<Edit className="cursor-pointer" onClick={_ => editAdditionalFields(item)} size="12"/>{" "}<Trash2 className="cursor-pointer" onClick={_ => deleteAdditionalFields(item)}size="13"/></p>)}</i></b>
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