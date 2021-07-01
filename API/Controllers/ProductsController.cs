using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Core.Specifications;
using AutoMapper;
using API.Dtos;

namespace API.Controllers
{
    public class ProductsController : ApiControllerBase
    {
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IGenericRepository<ProductBrand> _productBrandRepository;
        private readonly IGenericRepository<ProductType> _productTypeRepository;
        private readonly IMapper _mapper;

        public ProductsController(
            IGenericRepository<Product> productRepository,
            IGenericRepository<ProductBrand> productBrandRepository,
            IGenericRepository<ProductType> productTypeRepository,
            IMapper mapper)
        {
            _productBrandRepository = productBrandRepository;
            _productTypeRepository = productTypeRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetProducts()
        {
            var spec = new ProductsWithTypesAndBrandsSpecification();
            var products = await _productRepository.List(spec);
            var productDtos = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductDto>>(products);
            return Ok(productDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _productRepository.GetEntityWithSpec(spec);
            var productDto = _mapper.Map<Product, ProductDto>(product);
            return Ok(productDto);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            var brands = await _productBrandRepository.List();
            return Ok(brands);
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            var types = await _productTypeRepository.List();
            return Ok(types);
        }
    }
}