const clova = require('@line/clova-cek-sdk-nodejs');

const skillName = 'HTTPステータス検索';
const promptText = '３桁のHTTPステータスコードを言ってください。';
const sorryPromptText = 'すいません、ただしく聞き取れませんでした。もう一度言っていただけますか？';
const httpStatusCodes = require('./httpStatusCodes');

exports.handler = clova.Client
  .configureSkill()
  .onLaunchRequest(async responseHelper => {
    console.log("LaunchRequest called");
    responseHelper.setSessionAttributes({})
    let speechText = `${skillName}です。`;

    responseHelper.setSimpleSpeech(
      clova.SpeechBuilder.createSpeechText(speechText + promptText)
    );
    responseHelper.setSimpleSpeech(
      clova.SpeechBuilder.createSpeechText(promptText), true
    );
  })
  .onIntentRequest(async responseHelper => {
    const intent = responseHelper.getIntentName();
    const sessionId = responseHelper.getSessionId();

    switch (intent) {
      case 'HttpStatusCodeIntent': {
        console.log("StatusCodeIntent called");
        const slots = responseHelper.getSlots();
        console.log('slots:' + JSON.stringify(slots));
        // スロット名がおかしい
        if (!('statusCode' in slots)) {
          console.log("statusCode not found in slots.");
          responseHelper.setSimpleSpeech(
            clova.SpeechBuilder.createSpeechText(sorryPromptText)
          );
          responseHelper.setSimpleSpeech(
            clova.SpeechBuilder.createSpeechText(sorryPromptText), true
          );
          break;
        }
        // スロットに何も入っていない
        if (slots.statusCode === null) {
          console.log("statusCode is null.");
          responseHelper.setSimpleSpeech(
            clova.SpeechBuilder.createSpeechText(sorryPromptText)
          );
          responseHelper.setSimpleSpeech(
            clova.SpeechBuilder.createSpeechText(sorryPromptText), true
          );
          break;
        }
        // スロットを正しく受け取った
        const code = slots.statusCode;
        console.log(`code=${code}`);

        // httpStatusCodesオブジェクトを走査する
        let speechText;
        
        if (!(code in httpStatusCodes)) {
          speechText = `ステータスコード${code}は登録されていません。`;
        } else {
          speechText = `ステータスコード${code}ですね。ステータスコード${code}は、${httpStatusCodes[code].speechName}、です。`;
          if (httpStatusCodes[code].speechDesc !== undefined) {
            speechText += httpStatusCodes[code].speechDesc;
          } else {
            speechText += httpStatusCodes[code].Desc;
          }
        }
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText(speechText)
        );
        responseHelper.endSession();
        break;
      }
      case 'Clova.GuideIntent': {
        console.log("ClovaGuideIntent called");
        let speechText = 'このスキルでは、３桁のHTTPステータスコードを言うと、ステータスコードの意味を教えてくれます。例えば、「ステータスコード200を教えて」「404の意味を調べて」と言ってください。また、単に「302」とステータスコードを言うだけでも構いません。';

        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText(speechText + promptText)
        );
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText(promptText), true
        );
        break;
      }
      case 'Clova.CancelIntent': {
        console.log("Clova.CancelIntent called");
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText('ご利用ありがとうございました。')
        );
        responseHelper.endSession();
        break;
      }
      default: {
        console.log("falllback called");
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText(sorryPromptText)
        );
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText(sorryPromptText), true
        );
      }
    }
  })
  .onSessionEndedRequest(responseHelper => {
    const sessionId = responseHelper.getSessionId();
      // Do something on session end
      console.log("SessionEndRequest called");
  })
  .lambda()