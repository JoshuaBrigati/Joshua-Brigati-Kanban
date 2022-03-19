import React from "react";
import { Draggable } from 'react-beautiful-dnd';
import ItemCard from '../components/ItemCard';

const kanbanColumn = ({
  columnId,
  columnTitle,
  columnDescription,
  columnCards,
  handleEditColumn,
  handleEditCard,
  columnIndex,
  provided,
  deleteEmptyColumn,
  archiveCard
}) => {
  const makeItemList = () => {
    return columnCards.map((cardItem, index) => {
      return (
        <Draggable
          key={cardItem.id}
          draggableId={cardItem.id}
          index={index}
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

  return (
    <section className='kanban-column' {...provided.droppableProps} ref={provided.innerRef} key={columnIndex}>
      <div className='column-header'>
        <h2 onClick={() => handleEditColumn(columnId, columnTitle, columnDescription, columnIndex)}>{columnTitle}</h2>
        {!columnCards.length && <div className="delete-button" onClick={() => deleteEmptyColumn(columnId, columnIndex)}>delete</div>}
      </div>
      <div className='column-body'>
        {columnCards.length ? (
          makeItemList()
        ) : (
          <p className='column-description'>{columnDescription}</p>
        )}
      </div>
    </section>
  );
};

export default kanbanColumn;