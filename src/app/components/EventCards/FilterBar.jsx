import React from 'react';


// styled components
import { FilterWrapper } from '../../styles/FilterBar.jsx';

export default function FilterBar(props) {
  const {
    searchChange,
    searchField,
  } = props;

  return (
    <>
      <FilterWrapper>
        <input
          type="text"
          placeholder="filter actions by name..."
          onChange={searchChange}
          value={searchField}
        />
      </FilterWrapper>
    </>
  );
}
