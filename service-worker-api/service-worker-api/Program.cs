using WebPush;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(opt => opt.AddPolicy(
    "All",
    builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().SetIsOriginAllowedToAllowWildcardSubdomains()
    )
);

IConfiguration config = new ConfigurationBuilder().AddJsonFile("appsettings.json")
    .AddEnvironmentVariables()
    .Build();
var vapidDetails = new VapidDetails(
    config.GetValue<string>("VapidDetails:Subject"),
    config.GetValue<string>("VapidDetails:PublicKey"),
    config.GetValue<string>("VapidDetails:PrivateKey"));
builder.Services.AddTransient(c => vapidDetails);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors();
app.MapControllers();

app.Run();
