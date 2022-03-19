import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn';

const KanbanMain = ({
  onDragEnd,
  columns,
  setColumns,
  handleEditColumn,
  handleEditCard,
  deleteEmptyColumn,
  archiveCard
}) => {
  return (
    <div className='main'>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided) => {
                return (
                  <KanbanColumn
                    provided={provided}
                    columnTitle={column.name}
                    columnDescription={column.description}
                    columnCards={column.cards}
                    columnId={columnId}
                    handleEditColumn={handleEditColumn}
                    handleEditCard={handleEditCard}
                    columnIndex={index}
                    deleteEmptyColumn={deleteEmptyColumn}
                    archiveCard={archiveCard}
                  />
                );
              }}
            </Droppable>
          );
        })}
      </DragDropContext>
    </div>
  )
}

export default KanbanMain;