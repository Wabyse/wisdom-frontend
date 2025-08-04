function Selector2({ label, title, description, data, value, onChange, onClick=null, name="name", keyType=false, extraCSS, All=false, optionValue, optionalValue=true, labelCSS, selectCSS }) {
    return (
    <div className={`flex flex-col items-center justify-center ${extraCSS}`}>
      <label htmlFor={label} className={`font-bold m-[5px] ${labelCSS}`}>
        {title}
      </label>
      <select
        className={`${selectCSS}`}
        id={label}
        name={label}
        onChange={onChange}
        onClick={onClick}
        value={value}
      >
        <option value="" disabled>
          {description}
        </option>
        {All  && <option value="0">All</option>}
        {data.map((option, index) => (
          <option key={keyType ? index : optionValue === "user" ? option.employee.teacher?.id : option.id} value={keyType ? index : optionValue === "user" ? option.employee.teacher?.id : optionValue === "student" ? option.user_id : option.id}>
            {name === "" ? option : name === "user" ? `${option.employee?.first_name} ${option.employee?.middle_name} ${option.employee?.last_name}` : name === "userEmp" ? `${option.employee?.employee_first_name} ${option.employee?.employee_middle_name} ${option.employee?.employee_last_name}` : name === "userStd" ? `${option.first_name} ${option.middle_name} ${option.last_name}`: option[name]}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Selector2;