function Selectors({ label, title, description, data, value, onChange, onClick=null, name="normal", keyType=false, extraCSS, All=false, optionValue="", labelCSS, selectCSS }) {
    return (
    <div className={`flex flex-col ${extraCSS}`}>
      <label htmlFor={label} className={`font-bold m-[5px] ${labelCSS}`}>
        {title}
      </label>
      <select
        className={`p-[10px] text-[16px] md:w-[250px] w-[320px] rounded-[5px] border border-[#ccc] box-border text-black ${selectCSS}`}
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
          <option key={keyType ? index : option.id} value={keyType ? index : optionValue === "type" ? option[optionValue] : option.id}>
            {name === "normal" ? option : name === "ar" ? option.ar_name : name === "name" ? option.name : option.en_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Selectors;