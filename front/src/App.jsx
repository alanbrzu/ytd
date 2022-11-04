import { useEffect, useState } from "react";
import "./App.css";
import Info from "./components/Info/Info";

function App() {
  const [files, setFiles] = useState([]);
  const [option, setOption] = useState("");
  const [urls, setUrls] = useState([]);
  const [clips, setClips] = useState([]);
  const [downloaded, setDownloaded] = useState(false);
  const [nextDownload, setNextDownload] = useState();
  const [error, setError] = useState(null);

  const listEls = (el) => {
    const _newArr = el.split(",");
    const newEl = [];
    for (let i = 0; i < _newArr.length; i++) {
      newEl.push(_newArr[i].trim());
    }
    return newEl;
  };

  const downloadPython = () => {
    if (typeof nextDownload != "string") {
      console.log("Pick a song");
      setError("Pick a song");
    } else {
      setError(null);
      fetch("/home/download", {
        method: "POST",
        body: JSON.stringify({ _file: nextDownload }),
        headers: {
          "Content-type": "application/json",
        },
        referrerPolicy: "no-referrer",
      })
        .then((res) => res.blob())
        .then((res) => {
          const aElement = document.createElement("a");
          aElement.setAttribute("download", `${nextDownload}.mp3`);
          const href = URL.createObjectURL(res);
          aElement.href = href;
          aElement.setAttribute("target", "_blank");
          aElement.click();
          URL.revokeObjectURL(href);
          setNextDownload(null);
          const _fileIdx = files.indexOf(nextDownload);
          if (files.length <= 1) {
            setFiles([]);
          } else {
            const _newFiles = files.splice(_fileIdx, 1);
            console.log(_fileIdx);
            setFiles(_newFiles);
          }
        });
    }
  };

  const fetchPython = async () => {
    const response = await fetch("/home");
    try {
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createPython = async () => {
    setError(null);
    setDownloaded(false);
    const _urls = listEls(urls);
    const response = await fetch("/home/mp3", {
      method: "POST",
      body: JSON.stringify({ urls: _urls }),
      headers: {
        "Content-type": "application/json",
      },
    });
    try {
      const data = await response.json();
      const _arr = [];
      for (let i = 0; i < data.length; i++) {
        _arr.push(data[i]);
      }
      setFiles(_arr[0]);
      setDownloaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (option == "MP3" && urls.length > 0) {
      createPython();
      setUrls([]);
    } else {
      console.log("Choose option");
      setError("Choose option and enter URL");
    }
  };

  const handleDownload = async () => {
    if (files.length > 0) {
      downloadPython();
    } else {
      console.log("No files");
      setError("No files");
    }
  };

  useEffect(() => {
    console.log("nextDownload", nextDownload);
  }, [nextDownload]);

  useEffect(() => {
    console.log("clips", clips);
  }, [clips]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="App">
      {files ? (
        <div style={{ textAlign: "center" }}>
          {!nextDownload && files.length > 0 ? (
            <p>Click a file to download</p>
          ) : null}
          {!nextDownload && files.length == 0 ? (
            <p>Convert a file first</p>
          ) : null}
        </div>
      ) : null}
      {files ? (
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 0,
            gap: "10px",
          }}
        >
          <span>Files</span>
          {files.map((file, idx) => (
            <li
              onClick={() => setNextDownload(file)}
              style={{ fontSize: "12px", listStyle: "none" }}
              key={idx}
            >
              {file}
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p
          style={{
            position: "absolute",
            top: "332px",
            zIndex: 1000,
            fontSize: "14px",
            color: "#780000",
          }}
        >
          {error}
        </p>
      ) : null}

      <Info
        option={option}
        setOption={setOption}
        urls={urls}
        setUrls={setUrls}
        clips={clips}
        setClips={setClips}
        handleSubmit={handleSubmit}
        handleDownload={handleDownload}
        files={files}
        nextDownload={nextDownload}
      />
    </div>
  );
}

export default App;
