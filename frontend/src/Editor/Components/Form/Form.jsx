import React, { useRef, useState, useEffect } from 'react';
import { SubCustomDragLayer } from '@/Editor/SubCustomDragLayer';
import { SubContainer } from '@/Editor/SubContainer';
// eslint-disable-next-line import/no-unresolved
import { diff } from 'deep-object-diff';
import _, { omit } from 'lodash';
import { Box } from '@/Editor/Box';
import { generateUIComponents } from './FormUtils';
import { useMounted } from '@/_hooks/use-mount';
import { removeFunctionObjects } from '@/_helpers/appUtils';
import { useAppInfo } from '@/_stores/appDataStore';
export const Form = function Form(props) {
  const {
    id,
    component,
    width,
    height,
    containerProps,
    removeComponent,
    styles,
    setExposedVariable,
    setExposedVariables,
    darkMode,
    currentState,
    fireEvent,
    properties,
    resetComponent,
    childComponents,
    onEvent,
    dataCy,
    paramUpdated,
    adjustHeightBasedOnAlignment,
  } = props;

  const { events: allAppEvents } = useAppInfo();

  const formEvents = allAppEvents.filter((event) => event.target === 'component' && event.sourceId === id);
  const { visibility, disabledState, borderRadius, borderColor, boxShadow } = styles;
  const { buttonToSubmit, loadingState, advanced, JSONSchema } = properties;
  const backgroundColor =
    ['#fff', '#ffffffff'].includes(styles.backgroundColor) && darkMode ? '#232E3C' : styles.backgroundColor;
  const computedStyles = {
    backgroundColor,
    borderRadius: borderRadius ? parseFloat(borderRadius) : 0,
    border: `1px solid ${borderColor}`,
    height,
    display: visibility ? 'flex' : 'none',
    position: 'relative',
    overflow: 'hidden auto',
    boxShadow,
  };

  const parentRef = useRef(null);
  const childDataRef = useRef({});

  const [childrenData, setChildrenData] = useState({});
  const [isValid, setValidation] = useState(true);
  const [uiComponents, setUIComponents] = useState([]);
  const mounted = useMounted();

  useEffect(() => {
    const exposedVariables = {
      resetForm: async function () {
        resetComponent();
      },
      submitForm: async function () {
        if (isValid) {
          onEvent('onSubmit', formEvents).then(() => resetComponent());
        } else {
          fireEvent('onInvalid');
        }
      },
    };
    setExposedVariables(exposedVariables);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  const extractData = (data) => {
    const result = {};

    for (const key in data) {
      const item = data[key];

      if (item.name === 'Text') {
        const textKey = item?.formKey ?? item?.text;
        const nextItem = data[parseInt(key) + 1];

        if (nextItem && nextItem.name !== 'Text') {
          result[textKey] = { ...nextItem };
          delete result[textKey].name;
        }
      }
    }

    return result;
  };

  useEffect(() => {
    if (mounted) resetComponent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(JSONSchema)]);

  useEffect(() => {
    advanced && setExposedVariable('children', []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advanced]);

  useEffect(() => {
    setUIComponents(generateUIComponents(JSONSchema, advanced));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(JSONSchema), advanced]);

  const checkJsonChildrenValidtion = () => {
    const isValid = Object.values(childrenData).every((item) => item?.isValid !== false);
    return isValid;
  };

  useEffect(() => {
    let formattedChildData = {};
    let childValidation = true;

    if (childComponents === null) {
      const exposedVariables = {
        data: formattedChildData,
        isValid: childValidation,
        ...(!advanced && { children: formattedChildData }),
      };

      setExposedVariables(exposedVariables);
      return setValidation(childValidation);
    }

    if (advanced) {
      formattedChildData = extractData(childrenData);
      childValidation = checkJsonChildrenValidtion();
    } else {
      Object.keys(childComponents).forEach((childId) => {
        if (childrenData[childId]?.name) {
          formattedChildData[childrenData[childId].name] = { ...omit(childrenData[childId], 'name'), id: childId };
          childValidation = childValidation && (childrenData[childId]?.isValid ?? true);
        }
      });
    }
    formattedChildData = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(formattedChildData).map(([key, { formKey, ...rest }]) => [key, rest]) // removing formkey from final exposed data
    );
    const formattedChildDataClone = _.cloneDeep(formattedChildData);
    const exposedVariables = {
      ...(!advanced && { children: formattedChildDataClone }),
      data: removeFunctionObjects(formattedChildData),
      isValid: childValidation,
    };
    setValidation(childValidation);
    setExposedVariables(exposedVariables);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenData, childComponents, advanced, JSON.stringify(JSONSchema)]);

  useEffect(() => {
    const childIds = Object.keys(childrenData);
    Object.entries(currentState.components).forEach(([name, value]) => {
      if (childIds.includes(value.id) && name !== childrenData[value.id]?.name) {
        childDataRef.current = {
          ...childDataRef.current,
          [value.id]: { ...childDataRef.current[value.id], name: name },
        };
      }
    });
    if (Object.keys(diff(childrenData, childDataRef.current).length !== 0)) {
      setChildrenData(childDataRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentState.components]);

  useEffect(() => {
    document.addEventListener('submitForm', handleFormSubmission);
    return () => document.removeEventListener('submitForm', handleFormSubmission);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonToSubmit, isValid, advanced, JSON.stringify(uiComponents)]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const fireSubmissionEvent = () => {
    if (isValid) {
      onEvent('onSubmit', formEvents).then(() => resetComponent());
    } else {
      fireEvent('onInvalid');
    }
  };

  const handleFormSubmission = ({ detail: { buttonComponentId } }) => {
    if (!advanced) {
      if (buttonToSubmit === buttonComponentId) {
        fireSubmissionEvent();
      }
    } else if (buttonComponentId == uiComponents.length - 1 && JSONSchema.hasOwnProperty('submitButton')) {
      fireSubmissionEvent();
    }
  };
  //for custom json
  function onComponentOptionChangedForSubcontainer(component, optionName, value, componentId = '') {
    if (typeof value === 'function' && _.findKey({}, optionName)) {
      return Promise.resolve();
    }
    onOptionChange({ component, optionName, value, componentId });
    return containerProps.onComponentOptionChanged(component, optionName, value);
  }

  const onOptionChange = ({ component, optionName, value, componentId }) => {
    const optionData = {
      ...(childDataRef.current[componentId] ?? {}),
      name: component.name,
      [optionName]: value,
      formKey: component?.formKey, //adding this to use as exposed key
    };
    childDataRef.current = { ...childDataRef.current, [componentId]: optionData };
    setChildrenData(childDataRef.current);
  };

  return (
    <form
      className={`jet-container ${advanced && 'jet-container-json-form'}`}
      id={id}
      data-cy={dataCy}
      ref={parentRef}
      style={computedStyles}
      onSubmit={handleSubmit}
      onClick={(e) => {
        if (e.target.className === 'real-canvas') containerProps.onComponentClick(id, component);
      }} //Hack, should find a better solution - to prevent losing z index+1 when container element is clicked
    >
      {loadingState ? (
        <div className="p-2" style={{ margin: '0px auto' }}>
          <center>
            <div className="spinner-border mt-5" role="status"></div>
          </center>
        </div>
      ) : (
        <fieldset disabled={disabledState}>
          {!advanced && (
            <>
              <SubContainer
                parentComponent={component}
                containerCanvasWidth={width}
                parent={id}
                {...containerProps}
                parentRef={parentRef}
                removeComponent={removeComponent}
                onOptionChange={function ({ component, optionName, value, componentId }) {
                  if (componentId) {
                    onOptionChange({ component, optionName, value, componentId });
                  }
                }}
              />
              <SubCustomDragLayer
                containerCanvasWidth={width}
                parent={id}
                parentRef={parentRef}
                currentLayout={containerProps.currentLayout}
              />
            </>
          )}
          {advanced &&
            uiComponents?.map((item, index) => {
              return (
                <div
                  //check to avoid labels for these widgets as label is already present for them
                  className={
                    ![
                      'Checkbox',
                      'StarRating',
                      'Multiselect',
                      'DropDown',
                      'RadioButton',
                      'ToggleSwitch',
                      'ToggleSwitchNew',
                    ].includes(uiComponents?.[index + 1]?.component)
                      ? `json-form-wrapper`
                      : `json-form-wrapper  form-label-restricted`
                  }
                  key={index}
                >
                  <Box
                    component={item}
                    id={index}
                    width={width}
                    mode={containerProps.mode}
                    inCanvas={true}
                    paramUpdated={paramUpdated}
                    onEvent={onEvent}
                    onComponentOptionChanged={onComponentOptionChangedForSubcontainer}
                    onComponentOptionsChanged={containerProps.onComponentOptionsChanged}
                    onComponentClick={containerProps.onComponentClick}
                    currentState={currentState}
                    containerProps={containerProps}
                    darkMode={darkMode}
                    removeComponent={removeComponent}
                    parentId={id}
                    allComponents={containerProps.allComponents}
                    sideBarDebugger={containerProps.sideBarDebugger}
                    childComponents={childComponents}
                    adjustHeightBasedOnAlignment={adjustHeightBasedOnAlignment}
                    height={item.defaultSize.height}
                  />
                </div>
              );
            })}
        </fieldset>
      )}
    </form>
  );
};
