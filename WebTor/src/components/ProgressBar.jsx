// import ServerConsole from "./ServerConsole.jsx";


export default function ProgressBar({ value }) {
    return (
        // <div
        //     style={{
        //         width: "100%",
        //         marginTop: "30px",
        //         background: "#1e293b",
        //         borderRadius: "8px",
        //         overflow: "hidden"
        //     }}
        // >
        //     <div
        //         style={{
        //             width: `${value}%`,
        //             background: "#38bdf8",
        //             height: "12px",
        //             borderRadius: "8px",
        //             transition: "width 0.4s ease"
        //         }}
        //     />
        // </div>
        <div>
            <div style={{ width: "900px" }}>
                <div
                    style={{
                        width: "100%",
                        marginTop: "30px",
                        background: "#1e293b",
                        borderRadius: "8px",
                        overflow: "hidden"
                    }}
                >
                    <div
                        style={{
                            width: `${value}%`,
                            background: "#38bdf8",
                            height: "12px",
                            transition: "width 0.4s ease"
                        }}
                    />
                </div>
                {/* <ServerConsole /></div> */}
                <p style={{ marginTop: 10 }}>{value}%</p>
            </div></div>

    );
}
