import React, { useEffect, useState } from "react";
import "./Info.css";
import { AiOutlinePlus } from "react-icons/ai";

function Info({
  option,
  setOption,
  urls,
  setUrls,
  clips,
  setClips,
  handleSubmit,
  handleDownload,
  files,
  nextDownload,
}) {
  const [fields, setFields] = useState([""]);

  const addField = () => {
    const newFields = [...fields, ""];
    setFields(newFields);
  };

  const handleChange = (val, i) => {
    const thisVal = val.target.value;
    const _fields = [...fields];
    _fields.splice(i, 1, thisVal);
    setFields(_fields);
  };

  // Simply set fields to "" when clicking convert
  const handleConvert = () => {
    handleSubmit();
    setFields([""]);
  };

  useEffect(() => {
    setUrls(fields);
  }, [fields]);

  useEffect(() => {
    console.log("fields", fields);
  }, [fields]);

  return (
    <div className="formCont">
      <div className="optionsCont">
        <h3>Download options</h3>
        <span onClick={() => setOption("MP3")}>
          Download to MP3 (Single/Multiple)
        </span>
        <span onClick={() => setOption("M4A")}>
          Download to M4A directly (Single/Multiple)
        </span>
        <span onClick={() => setOption("Clips")}>
          Download Clips (Single Video Only)
        </span>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="form">
        {fields.map((field, idx) => (
          <div key={idx} className="inputCont">
            <input
              type="text"
              value={fields[idx]}
              onChange={(e) => handleChange(e, idx)}
              placeholder="URLs (separate by comma)"
            />
            <AiOutlinePlus
              onClick={() => addField()}
              style={{ fontSize: "18px" }}
            />
          </div>
        ))}
        {/* <div className="inputCont">
          <input
            type="text"
            value={clips}
            onChange={(e) => setClips(e.target.value)}
            placeholder="Clips"
          />
        </div>
        <p style={{ fontSize: "10px", marginTop: 0 }}>
          [8:55, 11:30], [13:20, 15:45]
        </p> */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button onClick={handleConvert}>Convert</button>
        </div>
      </form>

      <div className="optionsCont">
        <span>No age restricted currently =(</span>
      </div>
    </div>
  );
}

export default Info;
