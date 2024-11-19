import React from 'react';
import { getDate } from './utils';
import moment from 'moment';
import Timepicker from '@/ToolJetUI/Timepicker/Timepicker';

export const TimePicker = ({ value, onChange, meta }) => {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  return (
    <div
      //   data-cy={validation.dataCy}
      className="field flex-fill inspector-validation-date-picker"
      key={meta.property}
    >
      <label className="form-label">{meta.label}</label>
      <Timepicker
        selected={getDate(value, 'HH:mm')}
        onChange={(date) => onChange(moment(date).format('HH:mm'))}
        placeholderText={meta?.placeholder ?? ''}
        timeFormat={'HH:mm'}
        darkMode={darkMode}
      />
    </div>
  );
};
