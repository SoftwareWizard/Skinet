﻿using System;
using System.IO;
using System.Threading.Tasks;
using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ApiControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger _logger;
        private const string WhSecret = "whsec_9hAB4KDiQIEfDrAKUJzhwwgM4riSWNhl";

        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);

            return basket != null
                ? Ok(basket)
                : BadRequest(new ApiResponse(400, "Problem with your basket"));
        }

        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<ActionResult> StripeWebHook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeSignature = Request.Headers["Stripe-Signature"];

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, WhSecret);
                var paymentIntent = (PaymentIntent)stripeEvent.Data.Object;

                switch (stripeEvent.Type)
                {
                    case Events.PaymentIntentSucceeded:
                        await _paymentService.UpdateOrderPaymentStatus(paymentIntent.Id, stripeEvent.Type);
                        _logger.LogInformation($"Payment Intent succeeded {paymentIntent.Id} [paymentIntent.Id]");
                        break;
                    case Events.PaymentIntentPaymentFailed:
                        _logger.LogWarning($"Payment Intent failed {paymentIntent.Id} [paymentIntent.Id]");
                        await _paymentService.UpdateOrderPaymentStatus(paymentIntent.Id, stripeEvent.Type);
                        break;
                }

            }
            catch (StripeException exception)
            {
                Console.WriteLine(exception.Message);
            }


            return Ok();


        }
    }
}