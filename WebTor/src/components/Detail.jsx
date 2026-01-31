export default function Detail() {
    return (
        <div
            style={{
                textAlign: "center",
                fontSize: "10px"
            }}>
            <p>A BitTorrent client that downloads files by communicating directly with peers using the BitTorrent protocol.</p>
            <p>Supports torrent file parsing, tracker communication, piece-based downloading, and real-time progress tracking.</p>
            <p>Note: Currently supports UDP trackers only.</p>
            <p> © 2026 <a style={styles.link} target="_blank" href="https://github.com/vishwas-sanyal">Vishwas Sanyal</a></p>
        </div>
    )
}
const styles = {
    link: {
        color: "white",
        fontSize: "12px"
    }

}