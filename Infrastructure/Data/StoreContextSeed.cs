using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task Seed(StoreContext context, ILoggerFactory loggerFactory)
        {
            var logger = loggerFactory.CreateLogger<StoreContextSeed>();

            try
            {
                await SeedItems<ProductBrand>("brands.json", context, logger);
                await SeedItems<ProductType>("types.json", context, logger);
                await SeedItems<Product>("products.json", context, logger);
                await SeedItems<DeliveryMethod>("delivery.json", context, logger);
            }
            catch (Exception exception)
            {
                logger.LogError(exception, "Error while seeding");
            }
        }

        private static async Task SeedItems<TEntity>(string filename, DbContext context, ILogger logger) 
            where TEntity : EntityBase
        {
            if (!context.Set<TEntity>().Any())
            {
                var filepath = $"../Infrastructure/Data/SeedData/{filename}";
                var data = await File.ReadAllTextAsync(filepath);
                var items = JsonSerializer.Deserialize<List<TEntity>>(data);

                await context.Set<TEntity>().AddRangeAsync(items!);
                await context.SaveChangesAsync();
                logger.LogWarning($"Seeded {items.Count} {typeof(TEntity)}(s)");
            }
        }
    }
}