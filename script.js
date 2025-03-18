const API_KEY = "YOUR_API_KEY"; // 🔹 ここに取得した API キーを入力
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID"; // 🔹 出力先のスプレッドシートIDを入力

document.addEventListener("DOMContentLoaded", () => {
    initTable(10); // 初期10行追加
});

// ✅ テーブルに入力欄を初期表示
function initTable(rows) {
    let tableBody = document.getElementById("tableBody");
    for (let i = 0; i < rows; i++) {
        addRow(1);
    }
}

// ✅ 入力欄を追加
function addRow(count) {
    let tableBody = document.getElementById("tableBody");
    for (let i = 0; i < count; i++) {
        let row = document.createElement("tr");

        let artistCell = document.createElement("td");
        let artistInput = document.createElement("input");
        artistInput.type = "text";
        artistInput.className = "artist";
        artistCell.appendChild(artistInput);
        row.appendChild(artistCell);

        let songCell = document.createElement("td");
        let songInput = document.createElement("input");
        songInput.type = "text";
        songInput.className = "song";
        songCell.appendChild(songInput);
        row.appendChild(songCell);

        tableBody.appendChild(row);
    }
}

// ✅ 入力データを取得（アーティスト名が空なら1つ上を取得）
function getSongList() {
    let rows = document.querySelectorAll("#tableBody tr");
    let songList = [];
    let lastArtist = "";

    rows.forEach(row => {
        let artist = row.querySelector(".artist").value.trim();
        let song = row.querySelector(".song").value.trim();

        if (artist === "") {
            artist = lastArtist; // 1つ上のアーティスト名を取得
        } else {
            lastArtist = artist;
        }

        if (song !== "") {
            songList.push([artist, song]);
        }
    });

    return songList.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
}

// ✅ Google Sheets API を使ってデータをスプレッドシートに送信
function exportToGoogleSheets() {
    let songList = getSongList();
    if (songList.length === 0) {
        alert("データがありません！");
        return;
    }

    let values = [["アーティスト名", "曲名"]]; // ヘッダー行
    values = values.concat(songList); // データを追加

    let body = {
        values: values
    };

    let range = "入力用!A1"; // 🔹 出力先のシート
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW&key=${API_KEY}`;

    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        alert("スプレッドシートにデータを書き込みました！");
        console.log(data);
    })
    .catch(error => {
        console.error("エラー:", error);
        alert("エラーが発生しました");
    });
}
