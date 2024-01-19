import React, { useEffect, useState } from 'react';
import { ToolTip } from '@/_components/ToolTip';
import { resolveReferences } from '@/_helpers/utils';
import { useCurrentState } from '@/_stores/currentStateStore';
import Loader from '@/ToolJetUI/Loader/Loader';

export const Checkbox = function Checkbox({
  height,
  properties,
  styles,
  fireEvent,
  setExposedVariable,
  setExposedVariables,
  darkMode,
  dataCy,
  component,
  validate,
}) {
  const defaultValueFromProperties = properties.defaultValue ?? false;
  const [defaultValue, setDefaultvalue] = React.useState(defaultValueFromProperties);
  const [checked, setChecked] = React.useState(defaultValueFromProperties);
  const { label } = properties;
  const textColor = darkMode && styles.textColor === '#000' ? '#fff' : styles.textColor;
  const currentState = useCurrentState();
  const { loadingState, tooltip, disabledState } = properties;
  const { checkboxColor, boxShadow, alignment, padding, uncheckedColor, borderColor, handleColor } = styles;

  const [loading, setLoading] = useState(properties?.loadingState);
  const [disable, setDisable] = useState(disabledState || loadingState);
  const [visibility, setVisibility] = useState(properties.visibility);
  const { isValid, validationError } = validate(checked);
  const [calculatedHeight, setCalculatedHeight] = useState(height);

  const isMandatory = resolveReferences(component?.definition?.validation?.mandatory?.value, currentState);

  useEffect(() => {
    if (padding == 'default') {
      setCalculatedHeight(height + 10);
    }
  }, [padding]);

  function toggleValue(e) {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    setExposedVariable('value', isChecked);
    if (isChecked) {
      fireEvent('onCheck');
    } else {
      fireEvent('onUnCheck');
    }
  }
  useEffect(() => {
    const setCheckedAndNotify = async (status) => {
      await setExposedVariable('value', status);
      if (status) {
        fireEvent('onCheck');
      } else {
        fireEvent('onUnCheck');
      }
      setChecked(status);
    };
    const exposedVariables = {
      value: defaultValueFromProperties,
      setChecked: setCheckedAndNotify,
    };

    setDefaultvalue(defaultValueFromProperties);
    setChecked(defaultValueFromProperties);
    setExposedVariables(exposedVariables);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValueFromProperties, setChecked]);

  useEffect(() => {
    disable !== disabledState && setDisable(properties.disabledState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.disabledState]);

  useEffect(() => {
    visibility !== properties.visibility && setVisibility(properties.visibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.visibility]);

  useEffect(() => {
    loading !== loadingState && setLoading(loadingState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingState]);

  useEffect(() => {
    setExposedVariable('label', label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  useEffect(() => {
    setExposedVariable('isMandatory', isMandatory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMandatory]);

  useEffect(() => {
    setExposedVariable('isLoading', loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  useEffect(() => {
    setExposedVariable('isVisible', visibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibility]);

  useEffect(() => {
    setExposedVariable('isDisabled', disable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disable]);
  useEffect(() => {
    setExposedVariable('isValid', isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);
  useEffect(() => {
    setExposedVariable('setLoading', async function (loading) {
      setLoading(loading);
      setExposedVariable('isLoading', loading);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.loadingState]);

  useEffect(() => {
    setExposedVariable('setVisibility', async function (state) {
      setVisibility(state);
      setExposedVariable('isVisible', state);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.visibility]);

  useEffect(() => {
    setExposedVariable('setDisable', async function (disable) {
      setDisable(disable);
      setExposedVariable('isDisabled', disable);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabledState]);

  useEffect(() => {
    setExposedVariable('toggle', async function () {
      setExposedVariable('value', !checked);
      fireEvent('onChange');
      setChecked(!checked);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const renderCheckBox = () => (
    <div
      data-disabled={disabledState}
      className={`${alignment === 'right' ? 'flex-row-reverse' : ''}`}
      style={{
        display: visibility ? 'flex' : 'none',
        boxShadow,
        alignItems: 'center',
        gap: '8px ',
        justifyContent: `${loadingState ? 'center' : alignment == 'right' ? 'space-between' : ''}`,
        padding: padding === 'default' ? '4px 6px' : '',
        height: calculatedHeight == 30 ? (padding == 'default' ? '30px' : '20px') : calculatedHeight,
        whiteSpace: 'nowrap',
      }}
      data-cy={dataCy}
    >
      {loading ? (
        <Loader width="16" />
      ) : (
        <>
          <div
            onClick={handleToggleChange}
            style={{
              ...checkboxStyle,
            }}
          >
            <input
              style={{ display: 'none' }}
              className="form-check-input"
              type="checkbox"
              onClick={(e) => {
                toggleValue(e);
              }}
              defaultChecked={defaultValue}
              checked={checked}
            />
            <div style={checkmarkStyle}>
              {checked && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=" icon-tabler icon-tabler-check"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke={handleColor}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l5 5l10 -10" />
                </svg>
              )}
            </div>
          </div>

          <p
            className="form-check-label tj-text-xsm"
            style={{
              lineHeight: padding == 'none' && '12px',
              color: darkMode && textColor === '#11181C' ? '#ECEDEE' : textColor,
              display: 'block',
              overflow: label?.length > 6 && 'hidden', // Hide any content that overflows the box
              textOverflow: 'ellipsis', // Display ellipsis for overflowed content
              fontWeight: 500,
              textAlign: alignment == 'right' ? 'right' : 'left',
              fontSize: '14px',
            }}
          >
            {label}
            {isMandatory && !checked && <span style={{ color: '#DB4324', marginLeft: '1px' }}>{'*'}</span>}
          </p>
        </>
      )}
    </div>
  );
  const checkmarkStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    visibility: checked ? 'visible' : 'hidden',
    height: '16px',
    width: ' 16px',
    left: padding == 'default' ? alignment == 'left' && '14px' : alignment == 'left' && '8px',
    top: '50%',
    right: alignment == 'right' && padding == 'default' ? '-1.5px' : '-8px',
    display: 'flex',
  };

  const checkboxStyle = {
    display: 'inline-block',
    cursor: 'pointer',
    padding: '2px',
    border: `1px solid ${borderColor}`,
    backgroundColor: checked ? checkboxColor : uncheckedColor,
    borderRadius: '4px',
    minHeight: '16px',
    minWidth: '16px',
    borderColor: ['#D7DBDF'].includes(borderColor) ? (checked ? '#3E63DD' : '#D7DBDF') : borderColor,
  };
  const handleToggleChange = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    fireEvent('onChange');
    setExposedVariable('value', newCheckedState);
    if (newCheckedState) {
      fireEvent('onCheck');
    } else {
      fireEvent('onUnCheck');
    }
  };

  return (
    <div
      style={{
        height: calculatedHeight == 30 ? (padding == 'default' ? '30px' : '20px') : calculatedHeight,
        justifyContent: `${loadingState ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start'}`,
      }}
    >
      <>
        {properties?.tooltip?.length > 0 ? (
          <ToolTip message={tooltip}>
            <div>{renderCheckBox()}</div>
          </ToolTip>
        ) : (
          <div>{renderCheckBox()}</div>
        )}
      </>
      {validationError && visibility && (
        <div
          className="tj-text-sm"
          data-cy={`${String(component.name).toLowerCase()}-invalid-feedback`}
          style={{ color: '#DB4324' }}
        >
          {validationError}
        </div>
      )}
    </div>
  );
};
