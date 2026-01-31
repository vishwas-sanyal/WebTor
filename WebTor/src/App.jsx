import { useEffect } from "react";
import useTorrentProgress from "./hooks/useTorrentProgress.js";
import DropZone from "./components/DropZone.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import ServerConsole from "./components/ServerConsole.jsx";
import Detail from "./components/Detail.jsx"

export default function App() {
  const { progress, status } = useTorrentProgress();

  const startDownload = async (file) => {
    const formData = new FormData();
    formData.append("torrent", file);

    await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData
    });
  };

  useEffect(() => {
    const handleUnload = () => {
      navigator.sendBeacon("http://localhost:3000/stop");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <div
      style={{
        // minHeight: "100vh",
        // width: "100vw",
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        // background: "#0f172a",
        // color: "white"
        height: "100vh",
        width: "100vw",
        // display: "flex",
        alignContent: "center",
        justifyItems: "center",
        // justifyContent: "center",
        // alignItems: "center",
        background: "#000c27",
        color: "white"
      }}
    > <h1 style={{ alignContent: "center", fontSize: "50px" }}>WebTor</h1>
      {status === "idle" && <Detail />}
      {/* BEFORE DOWNLOAD */}
      {status === "idle" && <DropZone onFile={startDownload} />}

      <p>
        {status === "handshaking" && "Handshake process..."}
        {status === "downloading" && "Downloading..."}
      </p>

      {/* <p>Status: {status}</p>
      <p>Progress: {progress}</p> */}

      {/* DOWNLOADING */}
      {status === "downloading" && <ProgressBar value={progress} />}
      {status === "downloading" && <ServerConsole />}
      {status === "handshaking" && <ServerConsole />}


      {/* COMPLETED */}
      {progress === 100 && (
        <h2 style={{ color: "#22c55e" }}>
          ✅ Download Completed
        </h2>
      )}
    </div>
  );
}
