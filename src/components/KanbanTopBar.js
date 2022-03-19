const KanbanTopBar = ({
  boardName,
  setShowAddColumnModal,
  setShowAddCardModal,
  currentColumns
}) => {
  return (
    <div className='board-options'>
      <div className='board-options-left'>
        <div className='board-name'>{boardName}</div>
      </div>
      <div className='board-options-left'>
        <button className='add-column' onClick={() => setShowAddColumnModal(true)}>+ Add Column</button>
        <button className='add-card' onClick={() => setShowAddCardModal(true)} disabled={currentColumns.length === 0}>+ Add Card</button>
      </div>
    </div>
  )
}

export default KanbanTopBar;