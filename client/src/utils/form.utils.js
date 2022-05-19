import { useState, useEffect } from "react";
const FormUtil = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (e) => {
    setValues((currentVals) => ({
      ...currentVals,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const isValidated=Object.values(values).every(value=>value!=="")
    if(isValidated){
      callback()
    }
  };

  const clearValues = () => {
    setValues(initialState);
  };


  return {
    onChange,
    onSubmit,
    values,
    clearValues,
  };
};

export default FormUtil;
