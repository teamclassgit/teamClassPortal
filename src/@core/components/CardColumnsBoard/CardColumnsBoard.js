import React, { useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import CardAction from '@components/card-actions'
import { CardBody } from 'reactstrap'
import './CardColumnsBoard.scss'
// import { applyDrag, generateItems } from './utils'
// Fisrt status: quote
// last status: confirmed
const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
const columnNames = ['Quote', 'Proposal', 'Coordinating', 'Headcount', 'Invoiced', 'Confirmed']
const cardColors = ['azure', 'beige', 'bisque', 'blanchedalmond', 'burlywood', 'cornsilk', 'gainsboro', 'ghostwhite', 'ivory', 'khaki']
const pickColor = () => {
  const rand = Math.floor(Math.random() * 10)
  return cardColors[rand]
}
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
// children: generateItems(6, (i) => ({
//   id: `column${i}`,
//   type: 'container',
//   name: columnNames[i],
//   children: generateItems(+(Math.random() * 10).toFixed() + 5, (j) => ({
//     type: 'draggable',
//     id: `${i}${j}`,
//     data: lorem.slice(0, Math.floor(Math.random() * 150) + 30)
//   }))
// }))
const children = [
  {
    id: '',
    type: '',
    name: 'perro',
    children: [
      {
        type: 'draggable',
        id: '12',
        data: lorem.slice(0, Math.floor(Math.random() * 150) + 30)
      }
    ]
  }
]
const CardColumnsBoard = () => {
  const [scene, setScene] = useState({
    type: 'container',
    children
  })
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
      newColumn.children = applyDrag(newColumn.children, dropResult)
      newScene.children.splice(columnIndex, 1, newColumn)
      setScene(newScene)
    }
  }
  const getCardPayload = (columnId, index) => {
    return scene.children.filter((p) => p.id === columnId)[0].children[index]
  }
  return (
    <div className="card-setScene">
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
        {scene.children.map((column) => {
          return (
            <Draggable key={column.id}>
              <div
                className="
              "
              >
                <div className="mb-1 ml-1">{column.name}</div>
                <Container
                  groupName="col"
                  onDragStart={(e) => console.log('drag started', e)}
                  onDragEnd={(e) => console.log('drag end', e)}
                  onDrop={(e) => onCardDrop(column.id, e)}
                  getChildPayload={(index) => getCardPayload(column.id, index)}
                  dragClass="card-ghost"
                  dropClass="card-ghost-drop"
                  onDragEnter={() => {
                    console.log('drag enter:', column.id)
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
                  {column.children.map((card) => {
                    console.log('card', card)
                    return (
                      <Draggable key={card.id}>
                        <CardAction
                          title="Card Actions"
                          actions={['collapse', 'reload', 'remove']}
                          endReload={(endLoading) => {
                            setTimeout(() => endLoading(), 2000)
                          }}
                        >
                          <CardBody>{card.data}</CardBody>
                        </CardAction>
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
