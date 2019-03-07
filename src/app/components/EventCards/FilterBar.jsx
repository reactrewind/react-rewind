import React from 'react';


// styled components
import { FilterWrapper } from '../../styles/FilterBar.jsx';

export default function FilterBar(props) {
  const {
    searchChange
  } = props;

  return (
    <>
      <FilterWrapper>
        <input
          type="text"
          placeholder="filter actions by name..."
          onChange={searchChange}
        />
      </FilterWrapper>
    </>
  );
}
