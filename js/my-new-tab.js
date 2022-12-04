//chrome.storage.local.clear();

// タイトルを作成する
const timeTitle = [
  '0時', '1時', '2時', '3時', '4時', '5時',
  '6時', '7時', '8時', '9時', '10時', '11時',
  '12時', '13時', '14時', '15時', '16時', '17時',
  '18時', '19時', '20時', '21時', '22時', '23時'
];

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth()+1;
const date = now.getDate();
const hour = now.getHours();
const min = now.getMinutes();
const sec = now.getSeconds();
const today = `${year}年${month}月${date}日${hour}時${min}分${sec}秒`;
const todayStop = Date.now();

function setup() {

  chrome.storage.local.get(null, async (result) => {
    const data = result;
    console.log(data.canvasItems);
    console.log(data);

    let img = document.getElementsByClassName("image_place")[0]

    if(data.mouseItems && data.pageWidth && data.pageHeight) {
      const canvas = await createCanvas(data.pageWidth, data.pageHeight);
      console.log(canvas);
      // 背景色の設定
      background('rgb(255, 255, 255)');
      
      // 線を描画する
      let totalDistance = 0;
      for (let i = 0; i < data.mouseItems.length - 1; i++) {
        let p = i + 1;
        // line
        stroke('rgba(0, 0, 0, 0.3)');
        strokeWeight(5);
        noFill();
        line(data.mouseItems[i].mouseX, data.mouseItems[i].mouseY, data.mouseItems[p].mouseX, data.mouseItems[p].mouseY);

        // 総距離を計算する
        totalDistance = totalDistance + Math.sqrt( Math.pow( data.mouseItems[p].mouseX - data.mouseItems[i].mouseX, 2 ) + Math.pow( data.mouseItems[p].mouseY - data.mouseItems[i].mouseY, 2 ) )
      }
      console.log(totalDistance);
      //saveCanvas(canvas, 'myCanvas', 'jpg');
      //chrome.storage.local.clear();

      // canvasのurlをデータに保存する。
      let c = document.getElementById("defaultCanvas0");
      c.style.visibility = 'hidden';
      console.log(c.toDataURL());

      // 制作時間を計算する
      const time = (todayStop - data.mouseItems[0].todayStart)/1000
      const digit = 1;
      const creationTime = time.toFixed(digit);
      console.log(creationTime);

      let speedTitle;
      if (1 < time && time < 2) {
        speedTitle = '俊敏';
      } else if (2 < time && time < 4) {
        speedTitle = '軽快';
      } else if (4 < time && time < 6) {
        speedTitle = 'それなり';
      } else if (6 < time && time < 8) {
        speedTitle = 'ほどほど';
      } else if (8 < time && time < 10) {
        speedTitle = 'ゆったり';
      } else if (10 < time) {
        speedTitle = 'まったり';
      }

      // データを保存する
      let storage = {
        canvasItems: c.toDataURL(),
        hour,
        today,
        todayStop,
        creationTime,
        speedTitle,
        totalDistance
      };
      chrome.storage.local.set(storage);

      // 画像を表示する
      img.src = storage.canvasItems;

      // キャプションを追加する
      const html = `
      <div class="caption-black">
      <h1>${timeTitle[hour]}の${speedTitle}</h1>
      <p>制作日：${today}</p>
      <p>制作時間：${creationTime}秒</p>
      <p>総距離：${Math.trunc(totalDistance)}</p>
          <button id ="saveBtn">保存する</button><br>
      </div>
      `
      const elem = document.getElementsByClassName('img-caption')[0];
      elem.insertAdjacentHTML('afterbegin', html);
      
      // スクリーンショットを保存する
      const saveBtn = document.getElementById('saveBtn');
      const saveBtnFunc = () => {
        const downloadEle = document.createElement('a');
        downloadEle.href = `${storage.canvasItems}`;
        const t = Date.now();
        downloadEle.download = `MouseArt${t}.png`;
        downloadEle.click();
      };
      saveBtn.addEventListener('click', saveBtnFunc);

      //描画データを消去する
      chrome.storage.local.remove('mouseItems');
      chrome.storage.local.remove('pageWidth');
      chrome.storage.local.remove('pageHeight');

    } else if (data.canvasItems) {
      img.src = data.canvasItems;
      
      // キャプションを追加する
      const html = `
      <div class="caption-black">
      <h1>${timeTitle[data.hour]}の${data.speedTitle}</h1>
      <p>制作日：${data.today}</p>
      <p>制作時間：${data.creationTime}秒</p>
      <p>総距離：${Math.trunc(data.totalDistance)}</p>
      <button id ="saveBtn">保存する</button><br>
      </div>
      `
      const elem = document.getElementsByClassName('img-caption')[0];
      elem.insertAdjacentHTML('afterbegin', html);

      // スクリーンショットを保存する
      const saveBtn = document.getElementById('saveBtn');
      const saveBtnFunc = () => {
        const downloadEle = document.createElement('a');
        downloadEle.href = `${data.canvasItems}`;
        const t = Date.now();
        downloadEle.download = `MouseArt${t}.png`;
        downloadEle.click();
      };
      saveBtn.addEventListener('click', saveBtnFunc);

    } else {
      const html = `
        <div class="caption-white">
          <h1>Mouse Art</h1>
        </div>
        `;
        const elem = document.getElementsByClassName('img-caption')[0];
        elem.insertAdjacentHTML('afterbegin', html);
    }
  });
}

chrome.tabs.onActivated.addListener((tabId, windowId) => {
  console.log(tabId, windowId);
});
