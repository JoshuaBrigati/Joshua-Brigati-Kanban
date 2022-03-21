import React from 'react';

const ItemCard = ({
  cardId,
  columnId,
  cardIndex,
  cardTitle,
  cardDescription,
  cardTicketNumber,
  cardStatus,
  handleEditCard,
  provided,
  archiveCard
}) => {
  return (
    <div
      className='card'
      ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      onClick={(e) => handleEditCard(columnId, cardId, cardIndex, e)}
    >
      <div className='card-header'>
        <h4 className='card-title'>{cardTitle}</h4>
        <div className='archive-button' onClick={() => archiveCard(columnId, cardIndex)}>archive</div>
      </div>
      <p>{cardDescription}</p>
      <div className='card-info'>
        <p className='ticket-number'>{cardTicketNumber}</p>
        <p className='ticket-size'>{cardStatus}</p>
      </div>
    </div>
  );
};

export default ItemCard;