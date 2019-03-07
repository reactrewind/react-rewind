import React from 'react';

export default function FilterBar(props) {
  const {
    searchChange,
  } = props;

  return (
    <input
      type="text"
      placeholder="filter"
      onChange={searchChange}
    />
  );
}
