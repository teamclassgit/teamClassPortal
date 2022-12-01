// @packages
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import { X, Info, Settings, MessageSquare, Users } from "react-feather";

// @scripts
import Notes from "@molecules/notes";
import SettingsComponent from "@molecules/settings";
import BasicInformation from "@molecules/basicInformation";
import TeamMemberInstructor from "@molecules/teamMemberInstructor";

// @styles
import "./EditBookingModal.scss";

const EditBookingModal = ({
  currentElement,
  allClasses,
  allCoordinators,
  editMode,
  handleClose,
  handleModal,
  open,
  onEditCompleted,
  allInstructors
}) => {
  const [active, setActive] = useState("1");
  const [bookingNotes, setBookingNotes] = useState([]);
  const [calendarEvent, setCalendarEvent] = useState(null);
  const [closedBookingReason, setClosedBookingReason] = useState("");

  useEffect(() => {
    if (!currentElement?._id) return;
    setBookingNotes(currentElement.notes);
    setClosedBookingReason(currentElement.closedReason || "");
    setCalendarEvent(currentElement.calendarEvent);
  }, [currentElement]);

  const cancel = () => {
    setClosedBookingReason("");
    handleModal();
  };

  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />;

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  return (
    <Modal
      isOpen={open}
      className="sidebar-sm"
      modalClassName="modal-slide-in"
      contentClassName="pt-0"
      onClosed={() => {
        handleClose();
      }}
    >
      <ModalHeader toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">Edit Booking</h5>
      </ModalHeader>
      <Nav tabs className="d-flex justify-content-around mt-1">
        <NavItem>
          <NavLink
            title="Basic information"
            active={active === "1"}
            onClick={() => {
              toggle("1");
            }}
          >
            <Info size="18" />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            title="Settings"
            active={active === "2"}
            onClick={() => {
              toggle("2");
            }}
          >
            <Settings size="18" />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink title="Team member" active={active === "3"} onClick={() => toggle("3")}>
            <Users size="18" />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink title="Notes" active={active === "4"} onClick={() => toggle("4")}>
            <MessageSquare size="18" />
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-5" activeTab={active} color="primary">
        <TabPane tabId="1">
          <BasicInformation
            currentElement={currentElement}
            allInstructors={allInstructors}
            allClasses={allClasses}
            allCoordinators={allCoordinators}
            editMode={editMode}
            closedBookingReason={closedBookingReason}
            setClosedBookingReason={setClosedBookingReason}
            calendarEvent={calendarEvent}
            closeModal={cancel}
            onEditCompleted={onEditCompleted}
            bookingNotes={bookingNotes}
          />
        </TabPane>
        <TabPane tabId="3" className="px-2">
          <TeamMemberInstructor currentElement={currentElement}/>
        </TabPane>
        <TabPane tabId="4">
          <Notes bookingNotes={bookingNotes} setBookingNotes={setBookingNotes} currentElement={currentElement}></Notes>
        </TabPane>
        <TabPane tabId="2">
          <SettingsComponent
            currentElement={currentElement}
            editMode={editMode}
            closedBookingReason={closedBookingReason}
            cancel={cancel}
            onEditCompleted={onEditCompleted}
          />
        </TabPane>
      </TabContent>
    </Modal>
  );
};

export default EditBookingModal;
