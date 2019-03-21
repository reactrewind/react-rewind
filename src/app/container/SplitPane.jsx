import React from 'react';

// styled components
import { PaneWrapper, LeftPane, RightPane } from '../styles/SplitPane.jsx';

export default function SplitPane(props) {
  const { left, right } = props;
  return (
    <PaneWrapper>
      <LeftPane>{left}</LeftPane>
      <RightPane>{right}</RightPane>
    </PaneWrapper>
  );
}
