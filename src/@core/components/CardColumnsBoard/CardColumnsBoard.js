import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Container, Draggable } from 'react-smooth-dnd'
import { CardBody, CardText, Card } from 'reactstrap'
import './CardColumnsBoard.scss'
import { toAmPm } from '../../../utility/Utils'

const columnNames = ['quote', 'proposal', 'coordinating', 'headcount', 'invoiced', 'confirmed']

export const generateItems = (count, creator) => {
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(creator(i))
  }
  return result
}
export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr
  const result = [...arr]
  let itemToAdd = payload
  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }
  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }
  return result
}

const CardColumnsBoard = ({ bookings, customers, calendarEvents, classes }) => {
  console.log('llega', bookings)
  const [highlightColumn, setHighlighColumn] = useState(null)
  const [scene, setScene] = useState(null)

  const getFormattedEventDate = (bookingId) => {
    const result = calendarEvents.filter((element) => element.bookingId === bookingId)
    if (result && result.length > 0) {
      const calendarEvent = result[0]
      const date = new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day)
      const time = toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, '')
      return `${moment(date).format('LL')} ${time}`
    }
    return ''
  }

  const getData = (status, idx) => {
    const filtered = bookings.filter((item) => item.status === status)
    return filtered.map((item) => ({
      key: item.id,
      classTitle: classes.find(({ id }) => id === item.teamClassId).title,
      scheduled: getFormattedEventDate(item.id),
      ...item
    }))
  }

  useEffect(() => {
    console.log(classes)
    if (bookings.length) {
      const newScene = {
        type: 'container',
        children: columnNames.map((status, idx) => ({
          id: idx,
          status,
          data: getData(status, idx)
        }))
      }

      console.log('neweScene', newScene.children)

      setScene(newScene)
    }
  }, [bookings])

  // const children =

  const onColumnDrop = (dropResult) => {
    const newScene = Object.assign({}, scene)
    newScene.children = applyDrag(newScene.children, dropResult)
    setScene(newScene)
  }
  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      const newScene = Object.assign({}, scene)
      const column = newScene.children.filter((p) => p.id === columnId)[0]
      const columnIndex = newScene.children.indexOf(column)
      const newColumn = Object.assign({}, column)
      newColumn.data = applyDrag(newColumn.data, dropResult)
      newScene.children.splice(columnIndex, 1, newColumn)
      setScene(newScene)
    }
  }
  const getCardPayload = (columnId, index) => {
    return scene.children.filter((col) => col.id === columnId)[0].data[index]
  }
  return (
    <div>
      <Container
        orientation="horizontal"
        onDrop={(drop) => onColumnDrop(drop)}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'cards-drop-preview'
        }}
      >
        {scene &&
          scene.children.map((column) => {
            return (
              <Draggable key={column.id}>
                <div className={`board-column ${highlightColumn === column.id ? 'highlighted' : ''}`}>
                  <div className="mb-1 ml-1 text-capitalize">{column.status}</div>
                  <Container
                    groupName="col"
                    onDragStart={(e) => console.log('drag started', e)}
                    onDragEnd={(e) => setHighlighColumn(null)}
                    onDrop={(e) => onCardDrop(column.id, e)}
                    getChildPayload={(index) => getCardPayload(column.id, index)}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    onDragEnter={() => {
                      setHighlighColumn(column.id)
                    }}
                    onDragLeave={() => {
                      console.log('drag leave:', column.id)
                    }}
                    onDropReady={(p) => console.log('Drop ready: ', p)}
                    dropPlaceholder={{
                      animationDuration: 150,
                      showOnTop: true,
                      className: 'drop-preview'
                    }}
                    dropPlaceholderAnimationDuration={200}
                  >
                    {column.data.map(({ id, attendees, teamClassId, customerName, createdAt, classTitle, scheduled }) => {
                      return (
                        <Draggable key={id}>
                          <Card>
                            <CardBody>
                              <CardText>
                                {customerName} -{' '}
                                <small className="text-muted">
                                  {moment(createdAt).calendar(null, {
                                    lastDay: '[Yesterday]',
                                    sameDay: 'LT',
                                    lastWeek: 'dddd',
                                    sameElse: 'MMMM Do, YYYY'
                                  })}
                                </small>
                                <br />
                                <p className="mb-0 mt-1">{classTitle}</p>
                                <br />
                                <strong>{attendees} Attendees</strong>
                                <br />
                                {scheduled && (
                                  <span className="text-dark mt-3">
                                    Scheduled: <small className="text-dark">{scheduled}</small>
                                  </span>
                                )}
                              </CardText>
                            </CardBody>
                          </Card>
                        </Draggable>
                      )
                    })}
                  </Container>
                </div>
              </Draggable>
            )
          })}
      </Container>
    </div>
  )
}
export default CardColumnsBoard
