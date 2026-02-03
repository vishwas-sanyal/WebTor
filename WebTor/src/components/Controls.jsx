// import useTorrentProgress from "./../hooks/useTorrentProgress.js";

// export default function Controls() {

//     const { status } = useTorrentProgress();

//     return (
//         <div style={{ marginTop: 20 }}>
//             {status === "downloading" && (
//                 <button onClick={() => fetch("http://localhost:3000/pause", { method: "POST" })}>
//                     ⏸ Pause
//                 </button>
//             )}

//             {status === "paused" && (
//                 <button onClick={() => fetch("http://localhost:3000/resume", { method: "POST" })}>
//                     ▶️ Resume
//                 </button>
//             )}
//         </div>
//     );
// }
export default function Controls({ status }) {
    return (
        <div style={{ marginTop: 20 }}>
            {status === "downloading" && (
                <button
                    onClick={() =>
                        fetch("http://localhost:3000/pause", { method: "POST" })
                    }
                >
                    ⏸ Pause
                </button>
            )}

            {status === "paused" && (
                <button
                    onClick={() =>
                        fetch("http://localhost:3000/resume", { method: "POST" })
                    }
                >
                    ▶️ Resume
                </button>
            )}
        </div>
    );
}
