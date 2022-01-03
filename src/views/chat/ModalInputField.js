import React from "react";
import { HideIcon } from "@twilio-paste/icons/esm/HideIcon";
import { ShowIcon } from "@twilio-paste/icons/esm/ShowIcon";
import { Label, Input, Button } from "reactstrap";

const PrefixType = {
  SMS: "SMS",
  WhatsApp: "WhatsApp"
};

function getPrefixType (prefixType) {
  switch (prefixType) {
  case PrefixType.SMS:
    return "+";
  case PrefixType.WhatsApp:
    return "WhatsApp +";
  default:
    return undefined;
  }
}

const ModalInputField = (props) => {
  const prefixType = getPrefixType(props.prefixType);

  return (
    <>
      <Label htmlFor="modal-input">
        <div>{props.label}</div>
      </Label>
      <Input
        autoFocus={props.isFocused ?? false}
        type={props.inputType}
        value={props.input}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.currentTarget.value)}
        hasError={!!props.error}
        onBlur={props.onBlur}
        insertBefore={prefixType}
        insertAfter={
          props.showPassword !== undefined && (
            <>
              <Button
                variant="link"
                onClick={() => {
                  if (props.setShowPassword !== undefined) {
                    props.setShowPassword(!props.showPassword);
                  }
                }}
              >
                {props.showPassword ? <HideIcon /> : <ShowIcon />}
              </Button>
            </>
          )
        }
      />
    </>
  );
};

export default ModalInputField;
