using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.ProductBrand, source => source.MapFrom(x => x.ProductBrand.Name))
                .ForMember(dest => dest.ProductType, source => source.MapFrom(x => x.ProductType.Name))
                .ForMember(dest => dest.PictureUrl, source => source.MapFrom<ProductUrlResolver>());

            CreateMap<Core.Entities.Identity.Address, AddressDto>().ReverseMap();

            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();

            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>();
            CreateMap<Order, OrderToReturnDto>()
                .ForMember(dest => dest.DeliveryMethod, source => source.MapFrom(x => x.DeliveryMethod.ShortName))
                .ForMember(dest => dest.ShippingPrice, source => source.MapFrom(x => x.DeliveryMethod.Price));
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.ProductId, source => source.MapFrom(x => x.ItemOrdered.ProductItemId))
                .ForMember(dest => dest.ProductName, source => source.MapFrom(x => x.ItemOrdered.ProductName))
                .ForMember(dest => dest.PictureUrl, source => source.MapFrom(x => x.ItemOrdered.PictureUrl))
                .ForMember(dest => dest.PictureUrl, source => source.MapFrom<OrderItemUrlResolver>());
        }
    }
}