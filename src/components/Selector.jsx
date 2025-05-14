import React from 'react';

function Selector({ label, title, description, data, value, onChange, name="name", keyType=false, optionValue="" }) {
  return (
    <div className="flex flex-col items-end justify-center">
      <label htmlFor={label} className="font-bold m-[5px]">
        {title}
      </label>
      <select
        className="p-[10px] text-[16px] text-center w-[250px] rounded-[5px] border border-[#ccc] box-border"
        id={label}
        name={label}
        onChange={onChange}
        value={value}
      >
        <option value="" disabled>
          {description}
        </option>
        <option value="0">All</option>
        {data.map((option, index) => (
          <option key={keyType ? index : option.id} value={optionValue === "emp" ? option.employee.employee_id : option.id}>
            {name === "" ? option : name === "user" ? `${option.employee?.employee_first_name} ${option.employee?.employee_middle_name} ${option.employee?.employee_last_name}` : option[name]}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Selector;