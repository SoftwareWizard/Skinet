using API.Dtos;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class OrderItemUrlResolver : IValueResolver<OrderItem, OrderItemDto, string>
    {
        private readonly string _apiUrl;

        public OrderItemUrlResolver(IConfiguration configuration)
        {
            _apiUrl = configuration["ApiUrl"];
        }

        public string Resolve(OrderItem source, OrderItemDto destination, string destMember, ResolutionContext context)
        {
            var pictureUrl = source.ItemOrdered.PictureUrl;

            if (!string.IsNullOrEmpty(pictureUrl))
            {
                return $"{_apiUrl}{pictureUrl}";
            }

            return null;
        }
    }
}