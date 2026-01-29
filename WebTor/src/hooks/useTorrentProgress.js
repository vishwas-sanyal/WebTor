// import { useEffect, useState } from "react";

// export default function useTorrentProgress() {
//     const [progress, setProgress] = useState(0);

//     useEffect(() => {
//         const source = new EventSource("http://localhost:3000/progress");

//         source.onmessage = (e) => {
//             setProgress(Number(e.data));
//         };

//         source.onerror = () => {
//             source.close();
//         };

//         return () => source.close();
//     }, []);

//     return progress;
// }
// import { useEffect, useState } from "react";

// export default function useTorrentProgress() {
//     const [state, setState] = useState({
//         progress: 0,
//         status: "idle"
//     });

//     useEffect(() => {
//         const source = new EventSource("http://localhost:3000/progress");

//         source.onmessage = (e) => {
//             setState(JSON.parse(e.data));
//         };

//         return () => source.close();
//     }, []);

//     return state;
// }
import { useEffect, useState } from "react";

export default function useTorrentProgress() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("idle");

    useEffect(() => {
        const source = new EventSource("http://localhost:3000/progress");

        source.onmessage = (e) => {
            const data = JSON.parse(e.data);

            setProgress(data.progress);
            setStatus(data.status);
        };

        return () => source.close();
    }, []);

    return { progress, status };
}
