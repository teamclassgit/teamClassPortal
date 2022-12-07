// @packages
import React, { useState } from "react";
import Timeline from "@atoms/timeline";
import { Button, Card, CardBody, Input } from "reactstrap";
import moment from "moment";
import { useMutation } from "@apollo/client";

// @scripts
import { getUserData } from "@utility/Utils";
import mutationUpdateBookingNotes from "../../../graphql/MutationUpdateBookingNotes";
import { CornerUpRight, X } from "react-feather";

const Notes = ({bookingNotes, setBookingNotes, currentElement}) => {
  const [processing, setProcessing] = useState(false);
  const [inputNote, setInputNote] = useState("");
  const userData = getUserData();
  const [updateBookingNotes] = useMutation(mutationUpdateBookingNotes, {});

  const notes = bookingNotes ? bookingNotes.map((note, index) => (
    { 
      title: note.author.split(" ")[0],
      content: note.note,
      color: "secondary",
      meta: moment(note.date).fromNow(),
      customContent: userData?.customData?.name === note.author ?
        (note?.shared ? (
          <small>
            <a href="#" onClick={() => handleUpdateSharedNote(index)}>
              Shared
              <X width={20} />
            </a>
          </small>
        ) : (
          <small>
            <a href="#" onClick={() => handleUpdateSharedNote(index)}>
              Share with instructor
              <CornerUpRight width={20} />
            </a>
          </small>
        )) : null
    }
  )) : null;

  const saveNotes = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const newArray = bookingNotes ? [...bookingNotes] : [];
    newArray.unshift({
      note: inputNote,
      author: (userData && userData.customData && userData.customData["name"]) || "Unknown",
      date: new Date()
    });

    try {
      await updateBookingNotes({
        variables: {
          id: currentElement._id,
          notes: newArray,
          updatedAt: new Date()
        }
      });
      setBookingNotes(newArray.sort((a, b) => (a.date > b.date ? -1 : 1)));
      setInputNote("");
    } catch (ex) {
      console.error(ex);
    }
    setProcessing(false);
  };

  const handleUpdateSharedNote = async (index) => {
    const updateSharedNote = [...bookingNotes];
    const note = updateSharedNote[index];
    const shared = !note?.shared;
    const sharedNote = {
      ...note,
      shared
    };
    updateSharedNote[index] = sharedNote;
    try {
      await updateBookingNotes({
        variables: {
          id: currentElement._id,
          notes: updateSharedNote,
          updatedAt: new Date()
        }
      });
      setBookingNotes(updateSharedNote);
    } catch (ex) {
      console.error(ex);
    }
  };

  return (
    <>
      <b className="text-primary ml-2">Notes</b>
      <Card className="notes-card mt-1">
        <CardBody>
          {notes ? 
            <Timeline data={notes} className="p-0 m-0"/> :
              <p>Write your first note below...</p>
          }
        </CardBody>
      </Card>
      <div className=" ml-2 mr-2" align="right">
        <Input className="" type="textarea" id="bookingNotes" value={inputNote} onChange={(e) => setInputNote(e.target.value)} />
        <Button onClick={(e) => saveNotes(e)} size="sm" className="mt-1" color="primary" value={inputNote} disabled={!inputNote}>
          {processing ? "Saving note..." : "Add Note"}
        </Button>
      </div>
    </>
  );
};

export default Notes;
