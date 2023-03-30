import React, { useState } from 'react';
import '../../../css/Switch.css';
function OnOffSwitch() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <label className="switch">
      <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
      <span className="slider round"></span>
    </label>
  );
}

export default OnOffSwitch;
