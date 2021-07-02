using Core.Entities;

namespace Core.Specifications
{
    public class ProductWithFiltersForCountSpecification : SpecificationBase<Product>
    {
        public ProductWithFiltersForCountSpecification(ProductSpecParams productParams)
            : base(x => (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) &&
                        (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId))
        {
      }
    }
 }