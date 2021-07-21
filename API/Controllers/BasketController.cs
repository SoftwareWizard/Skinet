using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BasketController : ControllerBase
    {
        private readonly IBasketRepository _basketRepository;

        public BasketController(IBasketRepository basketRepository)
        {
            _basketRepository = basketRepository;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<CustomerBasket>> GetBasket(string id)
        {
            var basket = await _basketRepository.GetBasket(id);
            return Ok(basket ?? new CustomerBasket(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket([FromBody] CustomerBasket basket)
        {
            var updatedBasket = await _basketRepository.UpdateBasket(basket);
            return Ok(updatedBasket);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> DeleteBasket(string id)
        {
            var isDeleted = await _basketRepository.DeleteBasket(id);

            return isDeleted 
                ? Ok() 
                : NotFound();
        }
    }
}
