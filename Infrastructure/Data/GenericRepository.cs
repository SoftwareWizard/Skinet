using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class GenericRepository<T> : IGenericRepository<T> where T : EntityBase
    {
        private readonly StoreContext _context;
        public GenericRepository(StoreContext context) => _context = context;

        public async Task<T> GetById(int id) => await _context.Set<T>().FindAsync(id);

        public async Task<T> GetEntityWithSpec(ISpecification<T> spec) => await ApplySpecification(spec).FirstOrDefaultAsync();

        public async Task<IReadOnlyList<T>> List() => await _context.Set<T>().ToListAsync();

        public async Task<IReadOnlyList<T>> List(ISpecification<T> spec) => await ApplySpecification(spec).ToListAsync();

        private IQueryable<T> ApplySpecification(ISpecification<T> spec) =>
            SpecificationEvaluator<T>
                .GetQuery(_context.Set<T>().AsQueryable(), spec);
    }
}