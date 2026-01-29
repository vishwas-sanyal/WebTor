import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function ServerConsole() {
    const [logs, setLogs] = useState([]);
    const bottomRef = useRef(null);

    useEffect(() => {
        socket.on("log", (message) => {
            setLogs((prev) => [...prev, message]);
        });

        return () => socket.off("log");
    }, []);

    // Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div style={styles.console}>
            {logs.map((log, i) => (
                <div key={i} style={styles.line} >
                    → {log}
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}

const styles = {
    console: {
        background: "#0d0d0d",
        color: "#00ff9c",
        fontFamily: "monospace",
        padding: "12px",
        height: "200px",
        width: "900px",
        overflowY: "auto",
        borderRadius: "8px",
        border: "1px solid #333",
        marginTop: "50px"
    },
    line: {
        marginBottom: "4px",
        whiteSpace: "pre-wrap",
        fontSize: "15px"
    }
};
