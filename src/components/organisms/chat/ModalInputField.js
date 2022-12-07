// @packages
import React from "react";
import { Eye, EyeOff } from "react-feather";
import { Label, Input, Button } from "reactstrap";

const PrefixType = {
  SMS: "SMS",
  WhatsApp: "WhatsApp"
};

const getPrefixType = (prefixType) => {
  switch (prefixType) {
  case PrefixType.SMS:
    return "+";
  case PrefixType.WhatsApp:
    return "WhatsApp +";
  default:
    return undefined;
  }
};

const ModalInputField = ({
  error,
  input,
  inputType,
  isFocused,
  label,
  onBlur,
  onChange,
  placeholder,
  prefixType,
  setShowPassword,
  showPassword
}) => {
  const prefixTypes = getPrefixType(prefixType);

  return (
    <>
      <Label htmlFor="modal-input">
        <div>{label}</div>
      </Label>
      <Input
        autoFocus={isFocused ?? false}
        hasError={!!error}
        insertBefore={prefixTypes}
        onBlur={onBlur}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={placeholder}
        type={inputType}
        value={input}
        insertAfter={
          showPassword !== undefined && (
            <>
              <Button
                variant="link"
                onClick={() => {
                  if (setShowPassword !== undefined) {
                    setShowPassword(!showPassword);
                  }
                }}
              >
                {showPassword ? <EyeOff size={12} color="black" /> : <Eye size={12} color="black" />}
              </Button>
            </>
          )
        }
      />
    </>
  );
};

export default ModalInputField;
