import React, { useEffect, useState } from "react";
import { ModalBody, Button, ModalFooter } from "reactstrap";
import ConvoModal from "./ConvoModal";

const ConversationTitleBookingModal = (props) => {
  const [title, setTitle] = useState(props.title);
  const [value, setValue] = useState(props.value);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value);
    }
  }, [props.value]);

  const onCancel = () => {
    setError("");
    setTitle(props.value);
    props.onCancel();
  };

  const onSave = async () => {
    if (value.length < 1) {
      return;
    }

    setError("");

    try {
      await props.onSave(value);
    } catch (e) {
      setError("");
      console.log(e);
    }

    setValue(props.value);
  };

  return (
    <>
      <ConvoModal
        title={props.type === "new" ? "New Conversation" : "Edit Conversation"}
        isModalOpen={props.isModalOpen}
        handleClose={onCancel}
        modalBody={
          <ModalBody>
            <h2>Are you sure to start a conversation?</h2>
          </ModalBody>
        }
        modalFooter={
          <ModalFooter>
            <Button color="primary" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              color="primary"
              size="xs"
              onClick={onSave}
              disabled={value === null}
            >
              Save
            </Button>
          </ModalFooter>
        }
      />
    </>
  );
};

export default ConversationTitleBookingModal;
