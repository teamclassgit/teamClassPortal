// @packages
import Avatar from "@components/avatar";
import Proptypes from "prop-types";
import React, { useState } from "react";
import { ModalBody, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { TBody, Td, Tr } from "@twilio-paste/core";
import { User, ChevronDown, Trash } from "react-feather";

// @scripts
import ConvoModal from "./ConvoModal";

// @styles
import "./ManageParticipantsModal.scss";
import { getUserData } from "../../utility/Utils";

const ManageParticipantsModal = ({ handleClose, isModalOpen, onClick, onParticipantRemove, participantsCount, participantsList, title }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <>
      <ConvoModal
        handleClose={handleClose}
        isModalOpen={isModalOpen}
        title={title}
        modalBody={
          <ModalBody>
            <div className="modal-body-manage-participants">
              <div className="modal-participants-count">Participants ({participantsCount})</div>
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret nav>
                  <div className="modal-toggle">
                    Add Participant <ChevronDown size="20" />
                  </div>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      onClick("Add chat participant");
                    }}
                  >
                    Chat Participant
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      onClick("Add SMS participant");
                    }}
                  >
                    SMS Participant
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="modal-table-container">
              <Table>
                <TBody>
                  {participantsList.length ? (
                    participantsList.map((user) => {
                      return (
                        <Tr key={user.sid}>
                          <Td>
                            <Avatar
                              color={"light-dark"}
                              content={(user && user?.identity) || (user?.type === "sms" && "SMS") || "Unknown"}
                              initials
                            />
                          </Td>
                          <Td textAlign="left">
                            <span as="span" textAlign="left">
                              {user.type === "chat" ? user.identity : user?.type === "sms" ? "SMS User" : "Unknown"}
                            </span>
                          </Td>
                          <Td textAlign="right">
                            {user.identity !== getUserData()?.customData?.email ? (
                              <Trash href="#" onClick={() => onParticipantRemove(user)}>
                                Remove
                              </Trash>
                            ) : null}
                          </Td>
                        </Tr>
                      );
                    })
                  ) : (
                    <div className="modal-not-participants-container">
                      <div className="modal-not-participants-color">
                        <div className="modal-not-participants-user">
                          <User className="modal-not-participants-color" size={40} title="No participants" />
                        </div>
                        <p className="modal-not-participants-p">No participants</p>
                      </div>
                    </div>
                  )}
                </TBody>
              </Table>
            </div>
          </ModalBody>
        }
      />
    </>
  );
};

ManageParticipantsModal.propTypes = {
  handleClose: Proptypes.func.isRequired,
  isModalOpen: Proptypes.bool.isRequired,
  onClick: Proptypes.func.isRequired,
  onParticipantRemove: Proptypes.func.isRequired,
  participantsCount: Proptypes.number.isRequired,
  participantsList: Proptypes.array.isRequired,
  title: Proptypes.string.isRequired
};

export default ManageParticipantsModal;
