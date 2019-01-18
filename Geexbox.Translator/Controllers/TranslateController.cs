using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CognitiveServices.Translator;
using CognitiveServices.Translator.Configuration;
using CognitiveServices.Translator.Translate;
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
        [HttpGet("[action]")]
        public string Translate(string raw)
        {
            var result = this._translateService.Translate(raw);
            return result.to
        }
    }
}
