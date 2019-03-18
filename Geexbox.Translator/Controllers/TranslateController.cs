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
        /// ��Ҫ������ı�
        /// </summary>
        public string Text { get; set; }
        /// <summary>
        /// ����ӳ�伯�ϣ��ü����ڵ�key�ᱻ�����Value
        /// </summary>
        public List<DictItem> Dictionary { get; set; }
    }

    /// <summary>
    /// ����ӳ�����
    /// </summary>
    public class DictItem
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
