import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.scss';

const Home = lazy(() => import('./components/Home'));
const KanbanMain = lazy(() => import('./components/KanhanComponents/KanbanMain'));
const PageNotFound = lazy(() => import('./components/PageNotFound'));

function App() {
  return (
    <div className='app'>
      <Suspense fallback={<div>Page is Loading...</div>}>
        <Routes>
          <Route path="/" element={ <Home/> } />
          <Route path="/board:id" element={ <KanbanMain/> } />

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
