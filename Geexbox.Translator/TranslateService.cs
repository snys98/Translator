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
            Regex re = new Regex($@"\W({string.Join("|", rawDictionary.Keys)})\W", RegexOptions.Compiled);
            string output = re.Replace(text, match => rawDictionary.TryGetValue(match.Groups[1].Value, out var result) ? $"<mstrans:dictionary translation=\"{result}\">{match.Value}</mstrans:dictionary>" : match.Value);
            var response = _translateClient.Translate(
                new RequestContent(output),
                new RequestParameter
                {
                    From = "en", // Optional, will be auto-discovered
                    TextType = TextType.Html,
                    To = new[] { "zh" }, // You can translate to multiple language at once.
                    IncludeAlignment = true, // Return what was translated by what. (see documentation)
                });

            // response = array of sentenses + array of target language
            _logger.LogDebug(response.First().Translations.First().Text);

            return response;
        }
    }
}
