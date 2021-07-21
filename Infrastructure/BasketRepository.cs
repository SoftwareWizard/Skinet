using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;

        public BasketRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase(0);
        }

        public async Task<bool> DeleteBasket(string basketId)
        {
            return await _database.KeyDeleteAsync(basketId);
        }

        public async Task<CustomerBasket> GetBasket(string basketId)
        {
            var data = await _database.StringGetAsync(basketId);

            return !data.IsNullOrEmpty
                ? JsonSerializer.Deserialize<CustomerBasket>(data)
                : null;
        }

        public async Task<CustomerBasket> UpdateBasket(CustomerBasket basket)
        {
            var data = JsonSerializer.Serialize(basket);
            await _database.StringSetAsync(basket.Id, data, TimeSpan.FromDays(30));
            return basket;
        }
    }
}
