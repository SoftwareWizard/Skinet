# Entity Framework Commands

### Identity


`dotnet ef migrations add IdentityInitial -p Infrastructure -s API -c AppIdentityDbContext -o Identity/Migrations`

`dotnet ef database update -p Infrastructure -s API -c AppIdentityDbContext`