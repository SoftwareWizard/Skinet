using API.Errors;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API.Controllers
{
    [Route("errors/{code}")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController : ApiControllerBase
    {
        public IActionResult Error(int code)
        {
            if (code == (int)HttpStatusCode.Unauthorized)
            {
                return Unauthorized(new ApiResponse(code));
            }

            return new ObjectResult(new ApiResponse(code));
        }
    }
}