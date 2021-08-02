using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Address = Core.Entities.Identity.Address;

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

            CreateMap<Address, AddressDto>().ReverseMap();

            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();

            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>();
            CreateMap<OrderDto, Order>().ReverseMap();
        }
    }
}