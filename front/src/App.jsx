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

  const createPython = async () => {
    setError(null);
    setDownloaded(false);
    const response = await fetch("/home/mp3", {
      method: "POST",
      body: JSON.stringify({ urls }),
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
    console.log("urls", urls);
  }, [urls]);

  useEffect(() => {
    console.log(option);
  }, [option]);

  return (
    <div className="App">
      <div className="topCont">
        {files ? (
          <>
            <div className="topChild">
              <h3>Steps</h3>
              <p>1. Choose download option</p>
              <p>2. Enter url(s)</p>
              <p>3. Convert video</p>
              <p>4. Download</p>
            </div>
            <div className="topChild">
              <h3>Status</h3>
              <p>Files</p>
              {error ? <p style={{ color: "red" }}>{error}</p> : null}
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 0,
                  gap: "10px",
                }}
              >
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
            </div>
          </>
        ) : null}
      </div>

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
