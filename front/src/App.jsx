import { useEffect, useState } from "react";
import "./App.css";
import Info from "./components/Info/Info";
import { Alert, Snackbar } from "@mui/material";
import { AiOutlineDownload, AiOutlineCheck } from "react-icons/ai";

function App() {
  const [files, setFiles] = useState([]);
  const [option, setOption] = useState("MP3");
  const [urls, setUrls] = useState([""]);
  const [clips, setClips] = useState([]);
  const [downloaded, setDownloaded] = useState(false);
  const [nextDownload, setNextDownload] = useState();
  const [alert, setAlert] = useState({
    active: false,
    status: "",
    text: "",
  });

  const downloadPython = () => {
    if (typeof nextDownload != "string") {
      setAlert({
        active: true,
        status: "error",
        text: "Pick a song",
      });
      console.log("Pick a song");
    } else {
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
          setAlert({
            active: true,
            status: "success",
            text: "Downloaded successfully",
          });
          if (files[0].length <= 1) {
            setFiles([]);
          } else {
            const _fakeFiles = files[0];
            const _fileIdx = _fakeFiles.indexOf(nextDownload);
            const _newFiles = _fakeFiles.splice(_fileIdx, 1);
            console.log(_fileIdx);
            // setFiles(_newFiles);
          }
        });
    }
  };

  // Convert API call
  const createPython = async () => {
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
      setAlert({
        active: true,
        status: "success",
        text: "Sucessfully converted",
      });
      setFiles([...files, ..._arr[0]]);
      setDownloaded(true);
    } catch (error) {
      setAlert({
        active: true,
        status: "error",
        text: "Conversion Error",
      });
      console.log(error);
    }
  };

  // Convert handler
  const handleSubmit = async () => {
    if (option == "MP3" && urls.length > 0) {
      createPython();
      setUrls([""]);
    } else {
      console.log("Choose option");
      setAlert({
        active: true,
        status: "error",
        text: "Choose option and enter URL",
      });
    }
  };

  // Download handler
  const handleDownload = async () => {
    if (files.length > 0) {
      downloadPython();
    } else {
      setAlert({
        active: true,
        status: "error",
        text: "No files",
      });
      console.log("No files");
    }
  };

  useEffect(() => {
    console.log("files", files);
  }, [files]);

  useEffect(() => {
    console.log("nextDownload", nextDownload);
  }, [nextDownload]);

  return (
    <div className="App">
      <>
        {/* Steps */}
        <div className="topChild" id="child1">
          <h3>Steps</h3>
          <p className={`${option != "" ? "complete" : ""}`}>
            1. Choose download option (default: MP3)
          </p>
          <p className={`${urls[0].length > 0 ? "complete" : ""}`}>
            2. Enter URL(s)
          </p>
          <p className={`${files.length > 0 ? "complete" : ""}`}>
            3. Convert video
          </p>
          <p className={`${nextDownload != undefined ? "complete" : ""}`}>
            4. Select video to download
          </p>
          <p>5. Download</p>
        </div>
        {/* Files */}
        <div className="topChild" id="child2">
          <h3>Files</h3>
          <h4>Converted files:</h4>
          {files[0] ? (
            <ul>
              {files.map((file, idx) => (
                <li onClick={() => setNextDownload(file)} key={idx}>
                  {file}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {/* Queue */}
        <div className="topChild" id="child3">
          <h3>Queue</h3>
          <h4>Ready to download:</h4>
          {files.length > 0 && nextDownload ? (
            <>
              <p>{nextDownload}</p>
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "32px",
                  cursor: "pointer",
                }}
              >
                <AiOutlineDownload
                  onClick={handleDownload}
                  style={{ fontSize: "28px" }}
                />
              </div>
            </>
          ) : (
            <p>Choose file</p>
          )}
        </div>
      </>
      <Snackbar
        style={{ height: "80px" }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alert.active}
        autoHideDuration={10000}
        onClose={() =>
          setAlert({ ...alert, active: false, status: "", text: "" })
        }
      >
        <Alert
          variant="filled"
          severity={alert.status}
          style={{
            paddingTop: "0.75em",
            paddingBottom: "0.75em",
            paddingLeft: "1em",
            paddingRight: "2em",
          }}
        >
          <p>{alert.text}</p>
        </Alert>
      </Snackbar>

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
