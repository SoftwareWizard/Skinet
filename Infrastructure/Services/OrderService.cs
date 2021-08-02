using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IGenericRepository<DeliveryMethod> _deliveryMethodRepository;
        private readonly IGenericRepository<Order> _orderRepository;
        private readonly IGenericRepository<Product> _productRepository;

        public OrderService(IBasketRepository basketRepository, IGenericRepository<Order> orderRepository,
            IGenericRepository<Product> productRepository, IGenericRepository<DeliveryMethod> deliveryMethodRepository)
        {
            _basketRepository = basketRepository;
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _deliveryMethodRepository = deliveryMethodRepository;
        }

        public async Task<Order> CreateOrder(string buyerEmail, int deliveryMethodId, string basketId,
            Address shippingAddress)
        {
            var basket = await _basketRepository.GetBasket(basketId);

            var items = new List<OrderItem>();

            foreach (var basketProductItem in basket.Items)
            {
                var productItem = await _productRepository.GetById(basketProductItem.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, basketProductItem.Quantity);
                items.Add(orderItem);
            }

            var deliveryMethod = await _deliveryMethodRepository.GetById(deliveryMethodId);
            var subTotal = items.Sum(item => item.Price * item.Quantity);
            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subTotal);

        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUser(string buyersEmail)
        {
            throw new NotImplementedException();
        }

        public async Task<Order> GetOrderById(int id, string buyersEmail)
        {
            throw new NotImplementedException();
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethods()
        {
            throw new NotImplementedException();
        }
    }
}