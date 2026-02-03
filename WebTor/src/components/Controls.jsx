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
export default function Controls({ status, BACKEND_URL }) {
    return (
        <div style={{ marginTop: 20 }}>
            {status === "downloading" && (
                <button
                    onClick={() =>
                        fetch(`${BACKEND_URL}/pause`, { method: "POST" })
                    }
                >
                    ⏸ Pause
                </button>
            )}

            {status === "paused" && (
                <button
                    onClick={() =>
                        fetch(`${BACKEND_URL}/resume`, { method: "POST" })
                    }
                >
                    ▶️ Resume
                </button>
            )}
        </div>
    );
}
