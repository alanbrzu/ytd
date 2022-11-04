import React, { useState } from "react";
import "./Info.css";

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
  return (
    <div className="formCont">
      <div className="optionsCont">
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
        <div className="inputCont">
          <input
            type="text"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="URLs (separate by comma)"
          />
          <p style={{ fontSize: "12px" }}>Add</p>
        </div>
        <div className="inputCont">
          <input
            type="text"
            value={clips}
            onChange={(e) => setClips(e.target.value)}
            placeholder="Clips"
          />
        </div>
        <p style={{ fontSize: "10px", marginTop: 0 }}>
          [8:55, 11:30], [13:20, 15:45]
        </p>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button onClick={handleSubmit}>Convert</button>
          <button onClick={handleDownload}>Download</button>
        </div>

        {option ? (
          <p style={{ fontSize: "12px" }}>{option}</p>
        ) : (
          <p style={{ fontSize: "12px" }}>Choose options</p>
        )}
      </form>

      <div className="optionsCont">
        {files.length > 0 && nextDownload ? <p>Ready to download</p> : null}
        <span>No age restricted currently =(</span>
      </div>
    </div>
  );
}

export default Info;
