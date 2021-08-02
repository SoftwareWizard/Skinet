using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace Core.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrder(string buyerEmail, int deliveryMethod, string basketId, Address shippingAddress);
        Task<IReadOnlyList<Order>> GetOrdersForUser(string buyersEmail);
        Task<Order> GetOrderById(int id, string buyersEmail);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethods();
    }
}