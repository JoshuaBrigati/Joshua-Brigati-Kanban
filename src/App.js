import { useState } from 'react';
import './App.scss';
import AddOrEditColumnModal from './modals/AddOrEditColumnModal';
import AddOrEditCardModal from './modals/AddOrEditCardModal';
import { v4 as uuidv4 } from 'uuid';
import KanbanTopBar from './components/KanbanTopBar';
import KanbanMain from './containers/KanbanMain';

const columnsFromBackend = {
  [uuidv4()]: {
    name: "to-do",
    description: 'Used for tickets that need to be worked on.',
    cards: [
      {
        id: uuidv4(),
        cardTitle: 'First',
        cardDescription: 'We need to change font sizes so be different sizes.',
        cardStatus: 'open',
        cardCreatedDate: new Date(),
      }, {
        id: uuidv4(),
        cardTitle: 'Second',
        cardDescription: 'We need to change font sizes so be different sizes.',
        cardStatus: 'open',
        cardCreatedDate: new Date(),
      }, {
        id: uuidv4(),
        cardTitle: 'Third',
        cardDescription: 'We need to change font sizes so be different sizes.',
        cardStatus: 'open',
        cardCreatedDate: new Date(),
      }, {
        id: uuidv4(),
        cardTitle: 'Fourth',
        cardDescription: 'We need to change font sizes so be different sizes.',
        cardStatus: 'open',
        cardCreatedDate: new Date(),
      }, {
        id: uuidv4(),
        cardTitle: 'Fith',
        cardDescription: 'We need to change font sizes so be different sizes.',
        cardStatus: 'open',
        cardCreatedDate: new Date(),
      }, {
        id: uuidv4(),
        cardTitle: 'Sixth',
        cardDescription: 'We need to change font sizes so be different sizes.',
        cardStatus: 'open',
        cardCreatedDate: new Date(),
      }, {
        id: uuidv4(),
        cardTitle: 'Seventh',
        cardDescription: 'We need to change font sizes so be different sizes.',
        cardStatus: 'open',
        cardCreatedDate: new Date(),
      }, {
        id: uuidv4(),
        cardTitle: 'Eighth',
        cardDescription: 'We need to change font sizes so be different sizes.',
        cardStatus: 'open',
        cardCreatedDate: new Date(),
      },
    ]
  },
  [uuidv4()]: {
    name: "in-progress",
    description: 'Used for tickets being worked on.',
    cards: []
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceCards = [...sourceColumn.cards];
    const destCards = [...destColumn.cards];
    const [removed] = sourceCards.splice(source.index, 1);
    destCards.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        cards: sourceCards
      },
      [destination.droppableId]: {
        ...destColumn,
        cards: destCards
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedCards = [...column.cards];
    const [removed] = copiedCards.splice(source.index, 1);
    copiedCards.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        cards: copiedCards
      }
    });
  }
};

function App() {
  const boardName = 'Default Board';

  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [columns, setColumns] = useState(columnsFromBackend);
  const [currentColumns, setCurrentColumns] = useState(Object.entries(columnsFromBackend).map(column => ({ id: column[0], name: column[1].name })));

  const [columnToEdit, setColumnToEdit] = useState({})
  const [cardToEdit, setCardToEdit] = useState({});

  const addOrEditColumn = (columnId, columnName, columnDescription, isNew, columnIndex) => {
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
      setCurrentColumns([...currentColumns, { id: newColumnId, name: columnName }]);
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
      const currentColumnsHolder = [...currentColumns];
      currentColumnsHolder[columnIndex].name = columnName;
      setCurrentColumns([...currentColumnsHolder]);
      setShowAddColumnModal(false);
      setColumnToEdit({})
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

    const currentColumnsHolder = [...currentColumns]
    currentColumnsHolder.splice(columnIndex, 1);
    setCurrentColumns([...currentColumnsHolder]);
    setColumns({
      ...columnsCopy,
    });
  }

  const archiveCard = (columnId, cardIndex) => {
    const cardsCopy = columns[columnId].cards;
    console.log("🚀 ~ file: App.js ~ line 226 ~ archiveCard ~ columns[columnId]", columns[columnId])
    cardsCopy.splice(cardIndex, 1);

    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        cards: cardsCopy
      }
    });
  }

  return (
    <div className={`app ${showAddColumnModal || showAddCardModal ? 'blur' : ''} `}>
      <div className='container'>
        <KanbanTopBar
          boardName={boardName}
          setShowAddColumnModal={setShowAddColumnModal}
          setShowAddCardModal={setShowAddCardModal}
          currentColumns={currentColumns}
        />
        <KanbanMain
          onDragEnd={onDragEnd}
          columns={columns}
          setColumns={setColumns}
          handleEditColumn={handleEditColumn}
          handleEditCard={handleEditCard}
          deleteEmptyColumn={deleteEmptyColumn}
          archiveCard={archiveCard}
        />
      </div>

      {showAddColumnModal && (
        <AddOrEditColumnModal
          setShowAddColumnModal={setShowAddColumnModal}
          addOrEditColumn={addOrEditColumn}
          columnToEdit={columnToEdit}
          setColumnToEdit={setColumnToEdit}
        />
      )}
      {showAddCardModal && (
        <AddOrEditCardModal
          setShowAddCardModal={setShowAddCardModal}
          addOrEditCard={addOrEditCard}
          currentColumns={currentColumns}
          cardToEdit={cardToEdit}
          setCardToEdit={setCardToEdit}
        />
      )}
    </div>
  );
}

export default App;
