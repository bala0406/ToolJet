import React, { forwardRef, useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import DatePickerComponent from 'react-datepicker';
import CustomDatePickerHeader from './CustomDatePickerHeader';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker.scss';
import cx from 'classnames';
import SolidIcon from '@/_ui/Icon/SolidIcons';

const DISABLED_DATE_FORMAT = 'MM/DD/YYYY';

const TjDatepicker = forwardRef(({ value, onClick, styles, dateInputRef, readOnly }, ref) => {
  return (
    <div className="table-column-datepicker-input-container">
      <input
        onBlur={(e) => {
          e.stopPropagation();
        }}
        className={cx('table-column-datepicker-input', {
          'pointer-events-none': readOnly,
        })}
        value={value}
        onClick={onClick}
        ref={dateInputRef}
        style={styles}
      />
      <span>
        <SolidIcon
          width="16"
          fill={'var(--borders-strong)'}
          name="calender"
          className="table-column-datepicker-input-icon"
        />
      </span>
    </div>
  );
});

export const getDateTimeFormat = (dateDisplayFormat, isTimeChecked, isTwentyFourHrFormatEnabled) => {
  const timeFormat = isTwentyFourHrFormatEnabled ? 'HH:mm' : 'LT';
  return isTimeChecked ? `${dateDisplayFormat} ${timeFormat}` : dateDisplayFormat;
};

const getDate = ({
  value,
  parseDateFormat,
  timeZoneValue,
  timeZoneDisplay,
  unixTimestamp,
  parseInUnixTimestamp,
  isTimeChecked,
}) => {
  let momentObj = null;
  if (value) {
    if (parseInUnixTimestamp && unixTimestamp) {
      momentObj = unixTimestamp === 'seconds' ? moment.unix(value) : moment(parseInt(value));
    } else if (isTimeChecked && timeZoneValue && timeZoneDisplay) {
      momentObj = moment.tz(value, parseDateFormat, timeZoneValue).tz(timeZoneDisplay);
    } else {
      momentObj = moment(value, parseDateFormat);
    }
  }
  return momentObj?.isValid() ? momentObj.toDate() : null;
};

export const Datepicker = function Datepicker({
  value,
  onChange,
  readOnly,
  isTimeChecked,
  dateDisplayFormat, //?Display date format
  parseDateFormat, //?Parse date format
  timeZoneValue,
  timeZoneDisplay,
  isDateSelectionEnabled,
  isTwentyFourHrFormatEnabled,
  disabledDates,
  unixTimestamp,
  parseInUnixTimestamp,
  cellStyles,
  darkMode,
}) {
  const [date, setDate] = React.useState(null);
  const [excludedDates, setExcludedDates] = React.useState([]);
  const pickerRef = React.useRef();

  const handleDateChange = (date) => {
    const _date = getDate({
      value: date,
      parseDateFormat: getDateTimeFormat(parseDateFormat, isTimeChecked, isTwentyFourHrFormatEnabled),
      dateDisplayFormat,
      timeZoneValue,
      timeZoneDisplay,
      unixTimestamp,
      parseInUnixTimestamp,
      isTimeChecked,
    });
    setDate(_date);
    onChange(computeDateString(_date));
  };

  useEffect(() => {
    const date = getDate({
      value,
      parseDateFormat: getDateTimeFormat(parseDateFormat, isTimeChecked, isTwentyFourHrFormatEnabled),
      dateDisplayFormat,
      timeZoneValue,
      timeZoneDisplay,
      unixTimestamp,
      parseInUnixTimestamp,
      isTimeChecked,
    });
    setDate(date);
  }, [
    JSON.stringify(
      value,
      parseDateFormat,
      dateDisplayFormat,
      timeZoneValue,
      timeZoneDisplay,
      unixTimestamp,
      isTimeChecked,
      isTwentyFourHrFormatEnabled
    ),
  ]);

  const dateInputRef = useRef(null); // Create a ref

  const computeDateString = (value) => {
    const _date = getDate({
      value,
      parseDateFormat,
      dateDisplayFormat,
      timeZoneValue,
      timeZoneDisplay,
      unixTimestamp,
      parseInUnixTimestamp,
      isTimeChecked,
    });
    const timeFormat = isTwentyFourHrFormatEnabled ? 'HH:mm' : 'LT';
    const selectedDateFormat = isTimeChecked ? `${dateDisplayFormat} ${timeFormat}` : dateDisplayFormat;

    if (isDateSelectionEnabled && isTimeChecked && timeZoneDisplay) {
      return moment.tz(_date, timeZoneDisplay).format(selectedDateFormat);
    }

    if (isDateSelectionEnabled) {
      return moment(_date).format(selectedDateFormat);
    }

    if (!isDateSelectionEnabled && isTimeChecked) {
      return moment(_date).format(timeFormat);
    }
  };

  useEffect(() => {
    if (Array.isArray(disabledDates) && disabledDates.length > 0) {
      const _exluded = [];
      disabledDates?.map((item) => {
        if (moment(item, DISABLED_DATE_FORMAT).isValid()) {
          _exluded.push(moment(item, DISABLED_DATE_FORMAT).toDate());
        }
      });
      setExcludedDates(_exluded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabledDates]);
  return (
    <div ref={pickerRef}>
      <DatePickerComponent
        className={`input-field form-control validation-without-icon px-2`}
        popperClassName={cx({
          'tj-timepicker-widget': !isDateSelectionEnabled && isTimeChecked,
          'tj-datepicker-widget': isDateSelectionEnabled,
          'theme-dark dark-theme': darkMode,
        })}
        selected={date}
        onChange={(date) => handleDateChange(date)}
        value={date !== null ? computeDateString(date) : 'Invalid date'}
        dateFormat={dateDisplayFormat}
        customInput={
          <TjDatepicker dateInputRef={dateInputRef} readOnly={readOnly} styles={{ color: cellStyles.color }} />
        }
        showTimeSelect={isTimeChecked}
        showTimeSelectOnly={!isDateSelectionEnabled && isTimeChecked}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        excludeDates={excludedDates}
        showPopperArrow={false}
        renderCustomHeader={(headerProps) => <CustomDatePickerHeader {...headerProps} />}
        shouldCloseOnSelect
        readOnly={readOnly}
        popperProps={{ strategy: 'fixed' }}
        timeIntervals={15}
      />
    </div>
  );
};
