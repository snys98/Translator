using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CognitiveServices.Translator;
using CognitiveServices.Translator.Configuration;
using CognitiveServices.Translator.Translate;
using Microex.All.Extensions;
using Microsoft.AspNetCore.Mvc;

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
            var result = this._translateService.Translate(raw.Text, raw.Dictionary.ToDictionary(x => x.Key, x => x.Value));
            return result.ToJson();
        }
    }

    public class TestRequest
    {
        public string Text { get; set; }
        public List<DictItem> Dictionary { get; set; }
    }

    public class DictItem
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
