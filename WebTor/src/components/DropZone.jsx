import useTorrentProgress from "./../hooks/useTorrentProgress.js";

export default function DropZone({ onFile }) {
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];

        if (file && file.name.endsWith(".torrent")) {
            onFile(file);
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{
                // border: "2px dashed #38bdf8",
                // padding: "50px",
                // borderRadius: "14px",
                // textAlign: "center",
                // width: "400px",
                // cursor: "pointer"
                border: "2px dashed #254dff",
                padding: "50px",
                borderRadius: "12px",
                textAlign: "center",
                width: "400px",
                marginTop: "100px"
            }}
        >
            <h2>BitTorrent Client</h2>
            <p>Drag & drop a .torrent file</p>

            <input
                type="file"
                accept=".torrent"
                onChange={(e) => onFile(e.target.files[0])}
                style={{ marginLeft: "70px", }}
            />
        </div>
    );
}
