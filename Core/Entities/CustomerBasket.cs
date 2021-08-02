using System.Collections.Generic;

namespace Core.Entities
{
    public class CustomerBasket
    {
        public CustomerBasket() { }

        public CustomerBasket(string id)
        {
            Id = id;
        }

        public string Id { get; init; }

        public List<BasketItem> Items { get; set; }

        public int? DeliveryMethodId { get; set; }
        public string ClientSecret { get; set; }
        public string PaymentIntentId { get; set; }

    }
}
