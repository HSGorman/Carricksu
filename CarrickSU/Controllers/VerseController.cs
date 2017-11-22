using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CarrickSU.Models;
using System.IO;

namespace CarrickSU.Controllers
{
    public class VerseController : Controller
    {
        public IActionResult Index()
        {
            var verseList = new VerseList();
            
            var dirInfo = new DirectoryInfo("wwwroot/Verses/");
            verseList.List = dirInfo.GetFiles().Select(a => new ImageModel()
            {
                BaseUrl = Url.Action(@"/..", null, null),
                ImageUri = @"/Verses/" + a.Name
            }).ToList();

            return View(verseList);
        }

        public ActionResult ShowVerse(string imageUri)
        {
            var model = new ImageModel()
            {
                BaseUrl = Url.Action("/..", null, null),
                ImageUri = imageUri
            };
			return View(model);
        }

    }
}