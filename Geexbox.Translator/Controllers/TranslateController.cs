using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CognitiveServices.Translator;
using CognitiveServices.Translator.Configuration;
using CognitiveServices.Translator.Translate;
using Microex.All.Extensions;
using Microsoft.AspNetCore.Mvc;
using MoreLinq.Extensions;

namespace Geexbox.Translator.Controllers
{
    [Route("api/[controller]")]
    public class TranslateController : Controller
    {
        private readonly TranslateService _translateService;

        public TranslateController(TranslateService translateService)
        {
            _translateService = translateService;
        }
        [HttpPost("[action]")]
        public string Translate([FromBody]TestRequest raw)
        {
            var result = this._translateService.Translate(raw.Text, raw.Dictionary.DistinctBy(x=>x.Key).ToDictionary(x => x.Key, x => x.Value));
            return result.ToJson();
        }
    }

    public class TestRequest
    {
        /// <summary>
        /// 需要翻译的文本
        /// </summary>
        public string Text { get; set; }
        /// <summary>
        /// 翻译映射集合，该集合内的key会被翻译成Value
        /// </summary>
        public List<DictItem> Dictionary { get; set; }
    }

    /// <summary>
    /// 翻译映射对象
    /// </summary>
    public class DictItem
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
