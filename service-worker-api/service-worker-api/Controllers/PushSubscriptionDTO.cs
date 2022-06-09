namespace service_worker_api.Controllers
{
    public class PushSubscriptionDTO
    {
        public string Endpoint { get; set; }
        public Keys Keys { get; set; }
    }
}