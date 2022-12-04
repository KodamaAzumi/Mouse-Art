// スクリーンショットを取って保存する処理
const onClickEvent = async () => {

  // タブ情報取得
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // デバッガアタッチ
  chrome.debugger.attach({ tabId: tab.id }, '1.3', async () => {
    console.log('attach - ok');

    // デバッガ起動待機
    await new Promise((resolve) => setTimeout(resolve, 500));

    // レイアウト情報取得、metricsがページのレイアウトに関連する指標
    chrome.debugger.sendCommand({ tabId: tab.id }, 'Page.getLayoutMetrics', {}, (metrics) => {
      // スクリーンショットパラメータ作成
      const params = {
        format: 'png',
        quality: 50,
        clip: {
          x: 0,
          y: 0,
          width:  metrics.cssContentSize.width,
          height: metrics.cssContentSize.height,
          scale: 1
        },
        captureBeyondViewport: true
      }

      // スクリーンショット撮影
      chrome.debugger.sendCommand({ tabId: tab.id }, 'Page.captureScreenshot', params, (result) => {
        // スクリーンショットのurl
        const href = 'data:image/png;base64,' + result.data;

        console.log(result.data);

        // スクショのhrefをscreenshot.imgに入れる
        let screenshot = {};
        screenshot.img = href;

        // デバッガでタッチ
        chrome.debugger.detach({ tabId: tab.id }, () => {
          console.log('detach ok')
        });

        /*

        //現在の時刻を取得する
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth()+1;
        const date = now.getDate();
        const hour = now.getHours();
        const min = now.getMinutes();
        const sec = now.getSeconds();
        const today = `${year}年${month}月${date}日${hour}時${min}分${sec}秒`;
        const todayStop = Date.now();
        screenshot.hour = hour;
        screenshot.today = today;
        screenshot.todayStop = todayStop;

        // screenshot.imgに入れたhrefをchrome.storageで保存
        chrome.storage.local.set(screenshot, () => {
          console.log('Value is set to ' , screenshot);
        });

        */

        chrome.tabs.reload();

      });
    });
  });
};

document.getElementById('shbtn').addEventListener('click', onClickEvent);




  

  
