import React from 'react';

interface ManualDisplayProps {
  manual: string;
}

const ManualDisplay: React.FC<ManualDisplayProps> = ({ manual }) => (
  <div>
    <h2>Generated Manual</h2>
    <div dangerouslySetInnerHTML={{ __html: manual }} />
  </div>
);

export default ManualDisplay;