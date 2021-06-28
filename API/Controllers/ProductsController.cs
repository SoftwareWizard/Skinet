using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        [HttpGet]
        public string GetProducts()
        {
            return "this will be a lilst of products";
        }

        [HttpGet("{id}")]
        public string GetProduct(int id)
        {
            return $"this will be single product {id}";
        }

    }
}