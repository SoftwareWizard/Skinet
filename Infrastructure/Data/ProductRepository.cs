using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{

    public class ProductRepository : IProductRepository
    {
        private readonly StoreContext _context;
        public ProductRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<ProductBrand>> GetProductBrands() => await _context.ProductBrands.ToListAsync();

        public async Task<Product> GetProductById(int id) => await _context.Products
            .Include(p => p.ProductType)
            .Include(p => p.ProductBrand)
            .SingleOrDefaultAsync(item => item.Id == id);

        public async Task<IReadOnlyList<Product>> GetProducts() => await _context
            .Products
            .Include(p => p.ProductType)
            .Include(p => p.ProductBrand)
            .ToListAsync();

        public async Task<IReadOnlyList<ProductType>> GetProductTypes() => await _context.ProductTypes.ToListAsync();
    }
}