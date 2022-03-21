import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import {
  getBoardsForBoardsPage,
  addNewBoard,
} from '../utils/localStorageHelpers';
import { MainInput } from './Inputs/MainInput';

const Home = () => {
  const [boards, setBoards] = useState({});

  useEffect(() => {
    setBoards(getBoardsForBoardsPage());
  }, []);

  const handleNewBoard = boardName => {
    addNewBoard(boardName);
    setBoards(getBoardsForBoardsPage());
  }

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = handleSubmit(({ boardName }) => {
    handleNewBoard(boardName);
  });

  const boardName = register('boardName', { required: true });

  return (
    <div className='home'>
      {Object.entries(boards).length ? (
        <>
          <h1>Your Boards</h1>
          <section className='boards'>
            {Object.entries(boards).map(([index, board]) => (
              <Link to={`/board:${board.id}`} key={board.id} style={{ textDecoration: 'none', color: 'white' }}>
                <div className='board' key={index}>
                  <h2>{board.boardName}</h2>
                </div>
              </Link>
            ))}
          </section>
        </>
      ) : (
        <h1>You do not have any boards</h1>
      )}

      <form className={'new-board-input'} onSubmit={onSubmit} noValidate>
        <MainInput
          className={errors.boardName ? 'error' : ''}
          inputType={'text'}
          inputLabel={'Create a New Board'}
          isRequired={false}
          inputValue={getValues('boardName')}
          onChange={(e) => {
            setValue('boardName', e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            });
            boardName.onChange(e);
          }}
          errorType={errors.boardName?.type}
          autoFocus={false}
          placeHolder={'Board Name'}
        />
        <button
          type='submit'
          disabled={!getValues('boardName')}
        >
          Create
        </button>
      </form>
    </div>
  )
}

export default Home;