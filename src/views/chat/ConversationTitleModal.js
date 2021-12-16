import React, { useEffect, useState } from "react";
import ModalInputField from "./ModalInputField";
import { Box } from "@twilio-paste/core";
import { ModalBody, Button, ModalFooter } from "reactstrap";
import ConvoModal from "./ConvoModal";

const ConversationTitleModal = (props) => {
  const [title, setTitle] = useState(props.title);
  const [error, setError] = useState("");
  const [isFormDirty, setFormDirty] = useState(false);

  useEffect(() => {
    if (props.title !== title) {
      setTitle(props.title);
    }
  }, [props.title]);

  const onCancel = () => {
    setError("");
    setTitle(props.title);
    props.onCancel();
  };

  const onSave = async () => {
    if (title.length < 1) {
      return;
    }

    setError("");

    try {
      await props.onSave(title);
    } catch (e) {
      setError("");
      console.log(e);
    }

    setTitle(props.title);
  };

  return (
    <>
      <ConvoModal
        title={props.type === "new" ? "New Conversation" : "Edit Conversation"}
        isModalOpen={props.isModalOpen}
        handleClose={onCancel}
        modalBody={
          <ModalBody>
            <Box as="form">
              <ModalInputField
                isFocused={true}
                label="Conversation name"
                input={title}
                placeholder="Conversation name"
                onChange={setTitle}
                onBlur={() => setFormDirty(true)}
                error={
                  error
                    ? error
                    : isFormDirty && !title
                      ? "Add a conversation title to create a conversation."
                      : ""
                }
              />
            </Box>
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
              disabled={!title || title.length < 1 || error !== ""}
            >
              Save
            </Button>
          </ModalFooter>
        }
      />
    </>
  );
};

export default ConversationTitleModal;
