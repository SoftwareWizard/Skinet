using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;

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

            CreateMap<Address, AddressDto>()
                .ReverseMap();
        }
    }
}