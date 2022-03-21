import { v4 as uuidv4 } from 'uuid';

const getBoards = () => {
  let newObject = localStorage.getItem("boards");
  return JSON.parse(newObject);
}

const getBoardById = (boardId) => {
  const boards = getBoards() || {};
  return boards[boardId];
}

const getBoardsForBoardsPage = () => {
  const boards = getBoards() || {};

  return Object.entries(boards)
    .map(([boardId, board]) => ({ id: boardId, boardName: board.name }))
}

const addNewBoard = (name = '') => {
  const boards = getBoards() || {};

  localStorage.setItem(
    'boards',
    JSON.stringify({ ...boards, [uuidv4()]: { name: name, columns: {}, columnOrder: [] } })
  );
}

const setColumnsLocalStorage = (boardId, columns) => {
  if (boardId) {
    const boards = getBoards();

    localStorage.setItem(
      'boards',
      JSON.stringify({ ...boards, [boardId]: { ...boards[boardId], columns } })
    );
  }
}

const setColumnOrderLocalStorage = (boardId, columnOrder) => {
  if (boardId) {
    const boards = getBoards();

    localStorage.setItem(
      'boards',
      JSON.stringify({ ...boards, [boardId]: { ...boards[boardId], columnOrder } })
    );
  }
}

export { getBoards, getBoardById, getBoardsForBoardsPage, addNewBoard, setColumnsLocalStorage, setColumnOrderLocalStorage };