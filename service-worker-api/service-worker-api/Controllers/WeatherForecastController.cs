using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using WebPush;

namespace service_worker_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("All")]
    public class NotificationController : Controller
    {
        public static List<PushSubscription> Subscriptions { get; set; } = new List<PushSubscription>();

        [HttpGet("all")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public ActionResult<List<PushSubscription>> GetAll()
        {
            return Ok(Subscriptions);
        }

        [HttpPost("subscribe")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public ActionResult Subscribe([FromBody] PushSubscription sub)
        {
            Subscriptions.Add(sub);
            return Ok(sub);
        }

        [HttpPost("unsubscribe")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public OkResult Unsubscribe([FromBody] PushSubscription sub)
        {
            var item = Subscriptions.FirstOrDefault(s => s.Endpoint == sub.Endpoint);
            if (item != null)
            {
                Subscriptions.Remove(item);
            }
            return Ok();
        }

        [HttpPost("broadcast")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public ActionResult<List<PushSubscription>> Broadcast([FromBody] NotificationModel message, [FromServices] VapidDetails vapidDetails)
        {
            var client = new WebPushClient();
            var serializedMessage = JsonConvert.SerializeObject(message);
            foreach (var pushSubscription in Subscriptions)
            {
                client.SendNotification(pushSubscription, serializedMessage, vapidDetails);
            }
            return Ok(Subscriptions);

        }
    }
}