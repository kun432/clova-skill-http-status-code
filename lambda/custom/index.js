const clova = require('@line/clova-cek-sdk-nodejs');

const skillName = 'HTTPステータス検索';
const promptText = '三桁のHTTPステータスコードを言ってください。';
const promptText2 = 'もう一度言っていただけますか？';
const httpStatusCodes = require('./httpStatusCodes');

exports.handler = clova.Client
  .configureSkill()
  .onLaunchRequest(async responseHelper => {
    console.log("LaunchRequest called");
    responseHelper.setSessionAttributes({})
    const speechText = `${skillName}です。`;

    responseHelper.setSimpleSpeech(
      Clova.SpeechBuilder.createSpeechText(speechText)
    );
    responseHelper.setSimpleSpeech(
      Clova.SpeechBuilder.createSpeechText(promptText), true
    );
  })
  .onIntentRequest(async responseHelper => {
    const intent = responseHelper.getIntentName();
    const sessionId = responseHelper.getSessionId();

    switch (intent) {
      case 'StatusCodeIntent':
        console.log("StatusCodeIntent called");
        const statusCodeSlot = responseHelper.getSlot('statusCode');

        if (statusCodeSlot && statusCodeSlot.value) {
          const codeValue = statusCodeSlot.value;
          console.log(`codeValue=${codeValue}`);
          
          let speechText = `ステータスコード${codeValue}を受け取りました。処理を終了します。`;
          responseHelper.setSimpleSpeech(
            Clova.SpeechBuilder.createSpeechText(speechText)
          );
          endSession();
        } else {
          const speechText = 'すいません、ただしく聞き取れませんでした。もう一度言っていただけますか？';
          responseHelper.setSimpleSpeech(
            Clova.SpeechBuilder.createSpeechText(speechText)
          );
          responseHelper.setSimpleSpeech(
            Clova.SpeechBuilder.createSpeechText(speechText), true
          );
        }
        break;
      case 'Clova.GuideIntent':
        console.log("ClovaGuideIntent called");
        const speechText = 'このスキルでは、三桁のHTTPステータスコードを言うと、ステータスコードの意味を教えてくれます。例えば、「ステータスコード200を教えて」「404の意味を調べて」と言ってください。また、単に「302」とステータスコードを言うだけでも構いません。';

        responseHelper.setSimpleSpeech(
          Clova.SpeechBuilder.createSpeechText(speechText + promptText)
        );
        responseHelper.setSimpleSpeech(
          Clova.SpeechBuilder.createSpeechText(promptText), true
        );
        break;
      case 'Clova.CancelIntent':
        console.log("Clova.CancelIntent called");
        const speechText = 'ご利用ありがとうございました。';
        responseHelper.setSimpleSpeech(
          Clova.SpeechBuilder.createSpeechText(speechText)
        );
        endSession();
        break;
      default:
        console.log("falllback called");
        const speechText = 'すいません、ただしく聞き取れませんでした。もう一度言っていただけますか？';
        responseHelper.setSimpleSpeech(
          Clova.SpeechBuilder.createSpeechText(speechText)
        );
        responseHelper.setSimpleSpeech(
          Clova.SpeechBuilder.createSpeechText(speechText), true
        );
    }
  })
  .onSessionEndedRequest(responseHelper => {
    const sessionId = responseHelper.getSessionId();
      // Do something on session end
      console.log("SessionEndRequest called");
  })
  .lambda()