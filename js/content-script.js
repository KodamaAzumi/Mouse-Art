//chrome.storage.local.clear();

// データ確認用
chrome.storage.local.get(null, (result) => {
  console.log(result);
});

// マウスの座標をデータに保存する
const moveEvent = async (e) => {
  console.log(e)

  const mouseX = e.pageX;
  const mouseY = e.pageY;

  let storage = await chrome.storage.local.get(['mouseItems']);
  console.log(storage.mouseItems);
  if (storage.mouseItems) {
    storage.mouseItems.push({
      mouseX,
      mouseY
    });
    await chrome.storage.local.set(storage);
  } else {
    // 拡張機能を読み込んだ時刻をオブジェクトにする
    const todayStart = Date.now();
    let data ={ 
      mouseItems : [{
        mouseX,
        mouseY,
        todayStart
      }],
      pageWidth: document.documentElement.scrollWidth,
      pageHeight: document.documentElement.scrollHeight
    }
    await chrome.storage.local.set(data);
  }
};

document.addEventListener('mousemove' ,moveEvent);





