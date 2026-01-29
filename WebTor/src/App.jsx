// import { useState } from "react";
// import useTorrentProgress from "./hooks/useTorrentProgress";
// import ProgressBar from "./components/ProgressBar";


// function App() {
//   const [status, setStatus] = useState("Drop a .torrent file here");

//   const uploadTorrent = async (torrentFile) => {
//     const formData = new FormData();
//     formData.append("torrent", torrentFile);

//     setStatus("Uploading torrent...");

//     try {
//       const res = await fetch("http://localhost:3000/upload", {
//         method: "POST",
//         body: formData
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setStatus(`File "${data.name}" uploaded successfully!`);
//       } else {
//         setStatus(data.error || "Upload failed");
//       }
//     } catch (err) {
//       setStatus("Server not reachable");
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFile = e.dataTransfer.files[0];

//     if (droppedFile && droppedFile.name.endsWith(".torrent")) {
//       uploadTorrent(droppedFile);
//     } else {
//       setStatus("Please drop a .torrent file");
//     }
//   };
//   // const useTorrentProgress = () => {
//   //   const [progress, setProgress] = useState(0);

//   //   useEffect(() => {
//   //     const source = new EventSource("http://localhost:3000/progress");

//   //     source.onmessage = (e) => {
//   //       setProgress(Number(e.data));
//   //     };

//   //     return () => source.close();
//   //   }, []);

//   //   return progress;
//   // }

//   // const progress = useTorrentProgress();
//   const progress = useTorrentProgress();

//   return (
//     <div>
//       <div
//         onDrop={handleDrop}
//         onDragOver={(e) => e.preventDefault()}
//         style={{
//           height: "100vh",
//           width: "100vw",
//           // display: "flex",
//           alignContent: "center",
//           justifyItems: "center",
//           // justifyContent: "center",
//           // alignItems: "center",
//           background: "#000c27",
//           color: "white"
//         }}
//       >
//         <h1 style={{ alignContent: "center" }} >WebTor</h1>

//         {/* <div style={{ padding: 40, color: "white" }}>
//           <h2>Downloading</h2>
//           <Progress value={progress} />
//           <p>{progress}%</p>
//         </div> */}

//         <div
//           style={{
//             padding: "0 20px",
//             // minHeight: "100vh",
//             height: "80px",
//             width: "900px",
//             background: "#0f172a",
//             color: "white",
//             borderRadius: "12px",
//             border: "2px solid #254dff",
//             marginBottom: "30px",
//           }}
//         >
//           {/* <h6>Downloading Torrent</h6> */}

//           <ProgressBar value={progress} />

//           <p style={{ marginTop: 12 }}>{progress}%</p>
//         </div>

//         {/* <div
//           style={{
//             border: "2px dashed #254dff",
//             padding: "40px",
//             borderRadius: "12px",
//             textAlign: "center",
//             width: "400px"
//           }}
//         >
//           <h2>Torrent Client</h2>
//           <p>{status}</p>

//           <input
//             type="file"
//             style={{
//               marginLeft: "70px",
//             }}
//             accept=".torrent"
//             onChange={(e) => {
//               const f = e.target.files[0];
//               if (f) uploadTorrent(f);
//             }}
//           /> */}

//         {/* <p style={{ fontSize: "12px", marginTop: "10px", opacity: 0.7 }}>
//           Drag & drop or select a .torrent file
//         </p>
//       </div> */}
//       </div>
//     </div >
//   );
// }

// export default App;
import useTorrentProgress from "./hooks/useTorrentProgress.js";
import DropZone from "./components/DropZone.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import ServerConsole from "./components/ServerConsole.jsx";

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


      {/* COMPLETED */}
      {progress === 100 && (
        <h2 style={{ color: "#22c55e" }}>
          ✅ Download Completed
        </h2>
      )}
    </div>
  );
}
