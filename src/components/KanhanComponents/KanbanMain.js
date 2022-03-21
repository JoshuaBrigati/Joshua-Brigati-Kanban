import { useState, useEffect, Suspense, lazy } from "react";
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { KanbanColumn } from './KanbanColumn';
import {
  getBoardById,
  setColumnsLocalStorage,
  setColumnOrderLocalStorage,
} from '../../utils/localStorageHelpers';
import { reorderColumns, reorderCards } from "../../utils/ColumnDataHelpers";
import { useParams } from "react-router-dom";
import Navbar from "../Navs/Navigation";
import Loading from "../Loading";

const KanbanTopBar = lazy(() => import('./KanbanTopBar'));
const AddOrEditColumnModal = lazy(() => import('../../modals/AddOrEditColumnModal'));
const AddOrEditCardModal = lazy(() => import('../../modals/AddOrEditCardModal'));

const KanbanMain = () => {
  const { id } = useParams();

  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [columns, setColumns] = useState({});
  const [ordered, setOrdered] = useState([]);
  const [boardInfo, setBoardInfo] = useState({});;
  const [columnToEdit, setColumnToEdit] = useState({})
  const [cardToEdit, setCardToEdit] = useState({});

  useEffect(() => {
    const boardId = id.replace(/:/g, '');
    const board = getBoardById(boardId);

    setBoardInfo({ name: board.name, id: boardId });
    setColumns(board.columns || {});
    setOrdered(board.columnOrder);
  }, [id]);

  useEffect(() => {
    setColumnOrderLocalStorage(boardInfo.id, ordered);
  }, [ordered, boardInfo.id])

  useEffect(() => {
    setColumnsLocalStorage(boardInfo.id, columns)
  }, [columns, boardInfo.id]);

  const handleEditColumn = (columnId, columnName, columnDescription, columnIndex) => {
    setColumnToEdit({columnId, columnName, columnDescription, columnIndex});
    setShowAddColumnModal(true);
  }

  const handleEditCard = (columnId, cardId, cardIndex, e) => {
    if (e.target.className !== 'archive-button') {
      setCardToEdit({...columns[columnId].cards[cardIndex], columnId: columnId, cardIndex: cardIndex});
      setShowAddCardModal(true);
    }
  }

  const deleteEmptyColumn = (columnId, columnIndex) => {
    const columnsCopy = { ...columns };
    delete columnsCopy[columnId];

    const currentColumnsHolder = [...ordered]
    currentColumnsHolder.splice(columnIndex, 1);

    setOrdered(currentColumnsHolder)
    setColumns({
      ...columnsCopy,
    });
  }

  const archiveCard = (columnId, cardIndex) => {
    const cardsCopy = columns[columnId].cards;
    cardsCopy.splice(cardIndex, 1);

    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        cards: cardsCopy
      }
    });
  }

  const addOrEditColumn = (columnId, columnName, columnDescription, isNew) => {
    if (isNew) {
      const newColumnId = uuidv4();
      setColumns({
        ...columns,
        [newColumnId]: {
          name: columnName,
          description: columnDescription,
          cards: [],
        },
      });
      setOrdered([...ordered, newColumnId ]);
      setShowAddColumnModal(false);
    } else {
      setColumns({
        ...columns,
        [columnId]: {
          ...columns[columnId],
          name: columnName,
          description: columnDescription
        },
      });
      setShowAddColumnModal(false);
      setColumnToEdit({});
    }
  }

  const addOrEditCard = (columnId, card, isNew, cardIndex, originalColumnId) => {
    const column = columns[columnId];

    if (isNew) {
      const copiedCards = [...column.cards, { id: uuidv4(), ...card}];

      setColumns({
        ...columns,
        [columnId]: {
          name: column.name,
          description: column.description,
          cards: copiedCards,
        },
      });
      setShowAddCardModal(false);
    } else {
      if (originalColumnId !== columnId) {
        const sourceColumn = columns[originalColumnId];
        const destColumn = columns[columnId];
        const sourceCards = [...sourceColumn.cards];
        const destCards = [...destColumn.cards];

        const [removed] = sourceCards.splice(cardIndex, 1);
        destCards.splice(0, 0, removed);

        setColumns({
          ...columns,
          [originalColumnId]: {
            ...sourceColumn,
            cards: sourceCards
          },
          [columnId]: {
            ...destColumn,
            cards: destCards
          }
        });
      } else {
        const copiedCards = [...column.cards];
        copiedCards[cardIndex] = {...copiedCards[cardIndex], ...card};

        setColumns({
          ...columns,
          [columnId]: {
            name: column.name,
            description: column.description,
            cards: copiedCards,
          },
        });
        setCardToEdit({})
      }
      setCardToEdit({});
      setShowAddCardModal(false);
    }
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (result.type === "COLUMN") {
      const updatedOrdered = reorderColumns(ordered, source.index, destination.index);

      setOrdered(updatedOrdered);
      return;
    }

    const data = reorderCards({
      columns,
      source,
      destination
    });
    setColumns(data.columns);
  };

  return (
    <div className={`kanban-main ${showAddColumnModal || showAddCardModal ? 'blur' : ''} `}>
      <Navbar />
      <div className='container'>
        <Suspense fallback={<Loading />}>
          <KanbanTopBar
            boardName={boardInfo.name}
            setShowAddColumnModal={setShowAddColumnModal}
            setShowAddCardModal={setShowAddCardModal}
            currentColumns={ordered}
          />
        </Suspense>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <div className='main' {...provided.droppableProps} ref={provided.innerRef}>
                {ordered.map((columnId, index) => (
                  <Draggable draggableId={columnId} index={index} key={columnId}>
                    {(provided2) => (
                      <KanbanColumn
                        columnId={columnId}
                        columnTitle={columns[columnId]?.name}
                        columnDescription={columns[columnId]?.description}
                        columnCards={columns[columnId]?.cards}
                        handleEditColumn={handleEditColumn}
                        handleEditCard={handleEditCard}
                        columnIndex={index}
                        deleteEmptyColumn={deleteEmptyColumn}
                        archiveCard={archiveCard}
                        provided2={provided2}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {showAddColumnModal && (
        <Suspense fallback={<Loading />}>
          <AddOrEditColumnModal
            setShowAddColumnModal={setShowAddColumnModal}
            addOrEditColumn={addOrEditColumn}
            columnToEdit={columnToEdit}
            setColumnToEdit={setColumnToEdit}
          />
        </Suspense>
      )}
      {showAddCardModal && (
        <Suspense fallback={<Loading />}>
          <AddOrEditCardModal
            setShowAddCardModal={setShowAddCardModal}
            addOrEditCard={addOrEditCard}
            currentColumns={ordered.map(col => ({ id: col, name: columns[col].name })) || {}}
            cardToEdit={cardToEdit}
            setCardToEdit={setCardToEdit}
          />
        </Suspense>
      )}
    </div>
  );
};

export default KanbanMain;