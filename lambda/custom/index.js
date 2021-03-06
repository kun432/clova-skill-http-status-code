const clova = require('@line/clova-cek-sdk-nodejs');

const skillName = 'HTTPステータス検索';
const promptText = 'さん桁のHTTPステータスコードを言ってください。';
const sorryPromptText = 'すいません、ただしく聞き取れませんでした。もう一度言っていただけますか？';
const httpStatusCodes = require('./httpStatusCodes');

const clovaSkillHandler = clova.Client
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
        let speechText = 'このスキルでは、さん桁のHTTPステータスコードを言うと、ステータスコードの意味を教えてくれます。例えば、「ステータスコード200を教えて」「404の意味を調べて」と言ってください。また、単に「302」とステータスコードを言うだけでも構いません。';

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

exports.handler = async (event, content) => {

  const signature = event.headers.signaturecek || event.headers.SignatureCEK;
  const applicationId = process.env["applicationId"];
  const requestBody = event.body;
  // ヘッダーとスキルのExtensionIdとリクエストボディで検証
  await clova.verifier(signature, applicationId, requestBody);

  // 「Lambdaプロキシの結合」を有効にするとCEKからのJSONの中身は「event.body」で文字列で取得できる。
  var ctx = new clova.Context(JSON.parse(event.body));
  const requestType = ctx.requestObject.request.type;
  const requestHandler = clovaSkillHandler.config.requestHandlers[requestType];

  if (requestHandler) {
    await requestHandler.call(ctx, ctx);

    console.log("--- responseObject ---");
    console.log(ctx.responseObject);
    console.log("--- responseObject end ---");

    //　CEKに返すレスポンス
    const response =  {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": {},
        "body": JSON.stringify(ctx.responseObject),
    }
    console.log(response);
    return response;
  } else {
    throw new Error(`Unable to find requestHandler for '${requestType}'`);
  }
}