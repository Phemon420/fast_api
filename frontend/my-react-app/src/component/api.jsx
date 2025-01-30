import React,{useState} from 'react'
import withAuthentication from '../utils/withAuthentication'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
// import Navigate2 from './navigate2'
import RecipeSearch from './filter'

function Api() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div>
      {currentPage === 'home' && (
        <div>
          <button onClick={() => setCurrentPage('filter')}>Go to Filter</button>
        </div>
      )}
      {currentPage === 'filter' && <RecipeSearch />}
    </div>
  )
}

export default withAuthentication(Api)