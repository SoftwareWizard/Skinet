using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
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
                    var items = await LoadItems<ProductBrand>("brands.json");
                    await context.ProductBrands.AddRangeAsync(items!);
                    await context.SaveChangesAsync();
                }

                if (!context.ProductTypes.Any())
                {
                    var items = await LoadItems<ProductType>("types.json");
                    await context.ProductTypes.AddRangeAsync(items!);
                    await context.SaveChangesAsync();
                }

                if (!context.Products.Any())
                {
                    var items = await LoadItems<Product>("products.json");
                    await context.Products.AddRangeAsync(items!);
                    await context.SaveChangesAsync();
                }

                if (!context.DeliveryMethods.Any())
                {
                    var items = await LoadItems<DeliveryMethod>("delivery.json");
                    await context.DeliveryMethods.AddRangeAsync(items!);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception exception)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(exception, "Error while seeding");
            }
        }

        private static async Task<List<TEntity>> LoadItems<TEntity>(string filename)
        {
            var filepath = $"../Infrastructure/Data/SeedData/{filename}";
            var data = await File.ReadAllTextAsync(filepath);
            return JsonSerializer.Deserialize<List<TEntity>>(data);
        }
    }
}