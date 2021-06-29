using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task Seed(StoreContext context, ILoggerFactory loggerFactory)
        {
            try
            {
                if (!context.ProductBrands.Any())
                {
                    var data = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/brands.json");
                    var items = JsonSerializer.Deserialize<List<ProductBrand>>(data);

                    await context.ProductBrands.AddRangeAsync(items);
                    await context.SaveChangesAsync();
                }

                if (!context.ProductTypes.Any())
                {
                    var data = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/types.json");
                    var items = JsonSerializer.Deserialize<List<ProductType>>(data);

                    await context.ProductTypes.AddRangeAsync(items);
                    await context.SaveChangesAsync();
                }

                if (!context.Products.Any())
                {
                    var data = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");
                    var items = JsonSerializer.Deserialize<List<Product>>(data);

                    await context.Products.AddRangeAsync(items);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception exception)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(exception, "Error while seeding");
            }
        }
    }
}