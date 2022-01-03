// @packages
import {
  TBody,
  Td,
  Th,
  THead,
  Tr
} from "@twilio-paste/core";
import Avatar from '@components/avatar';
import { MenuButton, Menu, MenuItem, useMenuState } from "@twilio-paste/menu";
import { ModalBody, Table } from "reactstrap";
import { Text } from "@twilio-paste/text";
import { User, ChevronDown, Trash } from 'react-feather';

// @scripts
import ConvoModal from "./ConvoModal";

const ManageParticipantsModal = (
  props
) => {
  const menu = useMenuState({ placement: "bottom-start" });

  return (
    <>
      <ConvoModal
        handleClose={() => props.handleClose()}
        isModalOpen={props.isModalOpen}
        title={props.title}
        modalBody={
          <ModalBody>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "6px"
              }}
            >
              <div
                fontFamily="fontFamilyText"
                fontWeight="fontWeightBold"
                fontSize="fontSize30"
                lineHeight="lineHeight60"
              >
                Participants ({props.participantsCount})
              </div>
              <MenuButton {...menu} variant="secondary">
                Add Participant <ChevronDown decorative size="20" />
              </MenuButton>
              <Menu {...menu} aria-label="Preferences">
                <MenuItem
                  {...menu}
                  onClick={() => {
                    props.onClick("Add chat participant");
                  }}
                >
                  Chat Participant
                </MenuItem>
              </Menu>
            </div>
            <div
              style={{
                marginTop: "12px",
                overflow: "hidden",
                overflowY: "auto",
                maxHeight: "500px"
              }}
            >
              <Table>
                <THead hidden={true}>
                  <Tr>
                    <Th width="size10" style={{ width: "50px" }} />
                    <Th width="size40" textAlign="left" />
                    <Th textAlign="right" />
                  </Tr>
                </THead>
                <TBody>
                  {props.participantsList.length ? (
                    props.participantsList.map((user) => (
                      <Tr key={user.sid}>
                        <Td width="size20">
                          <Avatar
                            color={`light-dark`} 
                            content={(user && user?.identity) || 'Unknown'} 
                            initials
                          />
                        </Td>
                        <Td textAlign="left">
                          <Text as="span" textAlign="left">
                            {user.type === "chat"
                              ? user.identity
                              :
                              (user.attributes["friendlyName"]) ??
                                "unknown"}
                          </Text>
                        </Td>
                        <Td textAlign="right">
                          {user.identity !==
                          localStorage.getItem("username") ? (
                              <Trash
                                href="#"
                                onClick={() => props.onParticipantRemove(user)}
                              >
                              Remove
                              </Trash>
                            ) : null}
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "400px"
                      }}
                    >
                      <div
                        style={{
                          color: "#606B85"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingBottom: "12px"
                          }}
                        >
                          <User
                            decorative={false}
                            title="No participants"
                            size="sizeIcon40"
                            style={{
                              color: "#606B85"
                            }}
                          />
                        </div>
                        <Text
                          as="p"
                          fontSize="fontSize40"
                          style={{
                            color: "#606B85"
                          }}
                        >
                          No participants
                        </Text>
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

export default ManageParticipantsModal;
