import React from 'react'

import '../../style/search.css';

const Search = () => {



  return (
    <div className='searchContainer'>
        <div className='searchContainerBtns'>
            <button>MBTI</button><button>해쉬태그</button>
        </div>
        <div className='searchContainerInput'>
            <input></input><button>검색</button>
        </div>
      
    </div>
  )
}

export default Search
