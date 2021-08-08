using System;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IResponseCacheService
    {
        public Task CacheResponse(string cacheKey, object response, TimeSpan timeToLive);
        public Task<string> GetCachedResponse(string cacheKey);
    }
}