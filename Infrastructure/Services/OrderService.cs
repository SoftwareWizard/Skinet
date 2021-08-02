﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(IBasketRepository basketRepository, IUnitOfWork unitOfWork)
        {
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Order> CreateOrder(string buyerEmail, int deliveryMethodId, string basketId,
            Address shippingAddress)
        {
            var basket = await _basketRepository.GetBasket(basketId);

            var items = new List<OrderItem>();

            foreach (var basketProductItem in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetById(basketProductItem.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, basketProductItem.Quantity);
                items.Add(orderItem);
            }

            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetById(deliveryMethodId);
            var subTotal = items.Sum(item => item.Price * item.Quantity);
            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subTotal);
            _unitOfWork.Repository<Order>().Add(order);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return null;

            await _basketRepository.DeleteBasket(basketId);

            return order;
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUser(string buyersEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyersEmail);
            return await _unitOfWork.Repository<Order>().List(spec);
        }

        public async Task<Order> GetOrderById(int id, string buyersEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyersEmail);
            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethods()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().List();
        }
    }
}