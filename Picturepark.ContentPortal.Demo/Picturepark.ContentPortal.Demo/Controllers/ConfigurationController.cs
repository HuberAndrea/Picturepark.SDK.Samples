﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Picturepark.ContentPortal.Demo.Contract;

namespace Picturepark.ContentPortal.Demo.Controllers
{
    [Route("configuration")]
    public class ConfigurationController : Controller
    {
        private readonly IConfiguration _configuration;

        public ConfigurationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("client")]
        public IActionResult GetClientConfiguration()
        {
            var config = _configuration.GetSection("PictureparkConfiguration").Get<PictureparkConfiguration>();

            return Ok(new ClientConfiguration
            {
                ContactEmail = config.ContactEmail,
                IdentityServer = config.IdentityServer,
                FrontendUrl = config.FrontendBaseUrl,
                IsAuthenticated = HttpContext.User.Identity.IsAuthenticated
            });
        }
    }
}
