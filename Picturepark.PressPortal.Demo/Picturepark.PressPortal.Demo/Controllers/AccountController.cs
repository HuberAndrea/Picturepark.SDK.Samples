﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Picturepark.PressPortal.Demo.Services;

namespace Picturepark.PressPortal.Demo.Controllers
{
	public class AccountController : Controller
	{
	    internal static readonly string LoginPath = "/account/login";

	    [HttpGet]
		public IActionResult Login(string returnUrl = null)
		{
			if (!Url.IsLocalUrl(returnUrl)) returnUrl = "/";

			var props = new AuthenticationProperties
			{
				RedirectUri = returnUrl,
                Items = { { "localUrl", $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}" } }
			};

			return Challenge(props, "oidc");
		}

		public IActionResult Denied(string returnUrl = null)
		{
			return View();
		}

		public async Task<IActionResult> Info([FromServices]IPictureparkPerRequestService service)
		{
			if (User.Identity.IsAuthenticated)
			{
				var profile = await service.Profile.GetAsync();
				return View(profile);
			}

			return View(null);
		}

		public IActionResult Logout()
		{
			return SignOut("Cookies", "oidc");
		}
	}
}