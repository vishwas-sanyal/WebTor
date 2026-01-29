import React from "react";
import { useEffect, useState } from "react";

function useTorrentProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const source = new EventSource("http://localhost:3000/progress");

        source.onmessage = (e) => {
            setProgress(Number(e.data));
        };

        return () => source.close();
    }, []);

    return progress;
}

function Progress({ value }) {

    return (
        <div style={{ width: "100%", background: "#1e293b", borderRadius: "8px" }}>
            <div
                style={{
                    width: `${value}%`,
                    background: "#38bdf8",
                    height: "12px",
                    borderRadius: "8px",
                    transition: "width 0.5s ease"
                }}
            />
        </div>
    );
}