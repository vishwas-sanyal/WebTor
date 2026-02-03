import { useEffect } from "react";
import useTorrentProgress from "./hooks/useTorrentProgress.js";
import DropZone from "./components/DropZone.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import ServerConsole from "./components/ServerConsole.jsx";
import Detail from "./components/Detail.jsx";
import Controls from "./components/Controls.jsx";

export default function App() {
  const { progress, status } = useTorrentProgress();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const startDownload = async (file) => {
    const formData = new FormData();
    formData.append("torrent", file);
    try {
      await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData
      });
    }
    catch (err) {
      alert("❌ Backend server is not running.\nPlease start the server first.");
      return;
    }
  };

  useEffect(() => {
    const handleUnload = () => {
      navigator.sendBeacon(`${BACKEND_URL}/stop`);
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
      <Controls status={status} BACKEND_URL={BACKEND_URL} />
      {/* <p>Status: {status}</p>
      <p>Progress: {progress}</p> */}

      {/* DOWNLOADING */}
      {status === "downloading" && <ProgressBar value={progress} />}
      {status === "downloading" && <ServerConsole />}
      {status === "handshaking" && <ServerConsole />}
      {status === "paused" && <Detail />}

      {/* COMPLETED */}
      {progress === 100 && (
        <h2 style={{ color: "#22c55e" }}>
          ✅ Download Completed
        </h2>
      )}
    </div>
  );
}
