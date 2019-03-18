using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using CognitiveServices.Translator;
using CognitiveServices.Translator.Translate;
using Microsoft.Extensions.Logging;

namespace Geexbox.Translator
{
    public class TranslateService
    {
        private readonly ITranslateClient _translateClient;
        private readonly ILogger<TranslateService> _logger;

        public TranslateService(ITranslateClient translateClient, ILogger<TranslateService> logger)
        {
            _translateClient = translateClient;
            _logger = logger;
        }

        public IList<ResponseBody> Translate(string text, IDictionary<string, string> rawDictionary)
        {
            // 这个正则用于从输入文本中查找出所有的豁免内容，豁免内容不参与翻译
            Regex re = new Regex($@"\W({string.Join("|", rawDictionary.Keys)})\W", RegexOptions.Compiled);
            // 针对需要豁免的内容，将“内容”替换为“<mstrans:dictionary translation="期望结果">内容</mstrans:dictionary>”
            // mstrans:dictionary标签内的内容不参与翻译
            string output = re.Replace(text, 
                match => rawDictionary.TryGetValue(match.Groups[1].Value, out var result) 
                    ? $"<mstrans:dictionary translation=\"{result}\">{match.Value}</mstrans:dictionary>" 
                    : match.Value);
            // 调用翻译 API 的客户端，获取结果
            var response = _translateClient.Translate(
                new RequestContent(output),
                new RequestParameter
                {
                    From = "en", // 源语言
                    TextType = TextType.Plain,// 文本内容类型，支持纯文本和html
                    To = new[] { "zh" }, // 目标语言，可以一次返回多种目标语言.
                });

            // 这里会输出第一种目标语言的翻译结果
            _logger.LogDebug(response.First().Translations.First().Text);

            return response;
        }
    }
}
