import React from 'react';
import FormList from '../components/FormList';

const MyForms = () => {
  return (
    <div className="container">
      <div className="main-content">
        <FormList showAssignedToMe={false} />
      </div>
    </div>
  );
};

export default MyForms;