import React from 'react';
import FormList from '../components/FormList';

const ReviewForms = () => {
  return (
    <div className="container">
      <div className="main-content">
        <FormList showAssignedToMe={true} />
      </div>
    </div>
  );
};

export default ReviewForms;