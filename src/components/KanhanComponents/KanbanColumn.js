import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import ItemCard from './ItemCard';

const CardList = ({columnCards, columnId, handleEditCard, archiveCard}) => {
  return columnCards.map((cardItem, index) => {
    return (
      <Draggable
        key={cardItem.id}
        draggableId={cardItem.id}
        index={index}
        shouldRespectForceTouch={false}
      >
        {(provided) => {
          return (
            <ItemCard
              cardTitle={cardItem.cardTitle}
              cardDescription={cardItem.cardDescription}
              cardTicketNumber={0}
              cardStatus={cardItem.cardStatus}
              provided={provided}
              columnId={columnId}
              cardId={cardItem.id}
              handleEditCard={handleEditCard}
              cardIndex={index}
              archiveCard={archiveCard}
            />
          );
        }}
      </Draggable>
    )
  });
}

const KanbanColumn = ({
  columnId,
  columnTitle,
  columnDescription,
  columnCards,
  handleEditColumn,
  handleEditCard,
  columnIndex,
  deleteEmptyColumn,
  archiveCard,
  provided2
}) => {
  return (
    <section
      className='kanban-column'
      ref={provided2.innerRef}
      {...provided2.draggableProps}
    >
      <div className='column-header' {...provided2.dragHandleProps}>
        <h2 onClick={() => handleEditColumn(columnId, columnTitle, columnDescription, columnIndex)}>
          {columnTitle}
        </h2>
        {!columnCards.length && <div className="delete-button" onClick={() => deleteEmptyColumn(columnId, columnIndex)}>delete</div>}
      </div>
      <Droppable droppableId={columnId} type={"QUOTE"}>
        {(dropProvided) => (
          <div
            className='column-body'
            {...dropProvided.droppableProps}
            ref={dropProvided.innerRef}
          >
            {columnCards.length ? (
              <CardList
                columnCards={columnCards}
                columnId={columnId}
                handleEditCard={handleEditCard}
                archiveCard={archiveCard}
              />
            ) : (
              <p className='column-description'>{columnDescription}</p>
            )}
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
};

export {KanbanColumn, CardList};